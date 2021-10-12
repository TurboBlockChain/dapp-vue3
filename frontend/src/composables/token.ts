import { markRaw, watch, ref, computed } from "vue";
import {BigNumber, ethers, utils} from "ethers";
import { JsonRpcSigner } from "../utils/ethers";
import contractData from "@dapp-vue3/contracts/artifacts/contracts/Token.sol/Token.json";
import useMetaMask from "./metamask";
import NETWORK from "../constants";
import { isAddress } from "ethers/lib/utils";
import useConfig from "@/config";
import {Token} from "@dapp-vue3/contracts/typechain";

const { supportedChainIds } = useConfig();
const { getBalance, hasSetupWallet, signer, chainId } = useMetaMask();

const tokenAddress: Readonly<Record<string, string>> = {
  localhost: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  rinkeby: "0xBdeC61D40CEA359f92BaC3AEE54F3148e05Ec88B",
  goerli: "0xa1c2109014EB3093cdcE1896e1c2A2cB082Ea97a",
};

const token = ref<Token>();
const balance = ref<BigNumber>();

function clearState() {
  token.value = undefined;
  balance.value = undefined;
}

// if reset wallet, recreate the Greeter contract
watch(hasSetupWallet, async hasSetupWallet => {
  clearState();

  if (hasSetupWallet && signer.value && chainId.value) {
    if (supportedChainIds.includes(chainId.value)) {
      console.log("createContract when setting up new wallet");
      createContract(signer.value, chainId.value);
    }
  }
});

// reactive with useMetaMask
function createContract(signer: JsonRpcSigner, chainId: number) {
  if (supportedChainIds.includes(chainId)) {
    const contractAddress = tokenAddress[NETWORK(chainId)!.name];
    const _contract = new ethers.Contract(contractAddress, contractData.abi, signer) as Token;
    token.value = markRaw(_contract);
  } else {
    throw new Error("createContract: unsupported chainId");
  }
}

function connectContractAt(address: string) {
  let contract;
  if (!isAddress(address)) throw new Error("address is invalid");
  if (hasSetupWallet.value && signer.value && chainId.value) {
    // @issue: throw Error can't be handled when address is not valid.
    contract = new ethers.Contract(address, contractData.abi, signer.value) as Token;
  }
  return contract;
}

export function useTokenContract() {
  return {
    token,
    balance,
    contractData,
    tokenAddress: computed(() => token.value?.address),
    createContract,
    connectContractAt,
  };
}

// ============================ Contract Methods ============================

export function useGetBalanceOf() {
  const balance = ref<string>();
  const isLoading = ref(false);
  const errMsg = ref("");

  const getBalance = async (token: Token, address: string) => {
    errMsg.value = "";
    if (!token) {
      errMsg.value = "getTokenStr: contract doesn't set up";
      return;
    }

    try {
      isLoading.value = true;
      console.log(address);
      const res = await token.balanceOf(address);
      balance.value = utils.formatEther(res)
    } catch (e) {
      errMsg.value = e;
    } finally {
      isLoading.value = false;
    }
  };

  return { balance, isLoading, errMsg, getBalance };
}

export function useTransfer() {
  const isLoading = ref(false);
  const isPending = ref(false);
  const errMsg = ref("");

  const transfer = async (token: Token, address: string, amount: BigNumber) => {
    errMsg.value = "";

    if (!token) {
      errMsg.value = "setGreeting: contract doesn't set up";
      return;
    }

    try {
      isLoading.value = true;
      const tx = await token.transfer(address, amount);

      isPending.value = true;
      await tx.wait();
      isPending.value = false;
    } catch (e) {
      errMsg.value = e;
    } finally {
      isLoading.value = false;
    }
    getBalance();
  };

  return { isLoading, isPending, errMsg, transfer };
}
