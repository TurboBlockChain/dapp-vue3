import { ref, watch } from "vue";
import { Token } from "@dapp-vue3/contracts/typechain/Token";
import useConfig from "@/config";
import useMetaMask from "@/composables/metamask";

const { isDev } = useConfig();
const { hasSetupWallet } = useMetaMask();

export interface TokenData {
  address: string;
  token: Token;
  tokenStr: string;
}

const tokens = ref<TokenData[]>([]);

const addGreeter = (_token: TokenData) => {
  if (isDev) console.log("add greeter", _token);
  tokens.value.push(_token);
};

const updateGreeting = (address: string, tokenStr: string) => {
  if (isDev) console.log("update greeting", address, tokenStr);
  for (let i = 0; i < tokens.value.length; i++) {
    if (tokens.value[i].address === address) {
      tokens.value[i].tokenStr = tokenStr;
    }
  }
};

const clearGreeters = () => {
  if (isDev) console.log("clear all greeters");
  tokens.value = [];
};

// if reset wallet, clear greeters state
watch(hasSetupWallet, val => {
  if (val) {
    clearGreeters();
  }
});

export default function useGreeterStore() {
  return {
    tokens,
    addGreeter,
    updateGreeting,
  };
}
