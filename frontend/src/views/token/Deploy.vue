<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { ContractFactory } from "ethers";
import useMetaMask from "@/composables/metamask";
import { useTokenContract } from "@/composables/token";
import {Token} from "@dapp-vue3/contracts/typechain/Token";
import {TokenFactory} from "@dapp-vue3/contracts/typechain";

export default defineComponent({
  name: "token-deploy",
  setup() {
    const { signer, userAddress } = useMetaMask();
    const { contractData } = useTokenContract();

    const param1 = ref("");
    const contractAddress = ref("");
    const errMsg = ref("");
    const txPending = ref(false);

    const deploy = async () => {
      errMsg.value = "";

      try {
        txPending.value = true;
        const tokenFactory = new ContractFactory(
          contractData.abi,
          contractData.bytecode,
          signer.value
        ) as TokenFactory;
        const token = (await tokenFactory.deploy(userAddress.value)) as Token;
        await token.deployed();

        contractAddress.value = token.address;
        param1.value = "";
      } catch (e) {
        errMsg.value = e.message;
      } finally {
        txPending.value = false;
      }
    };
    return {
      param1,
      contractAddress,
      errMsg,
      txPending,
      deploy,
    };
  },
});
</script>


<template>
  <div class="text-center text-gray-6">
    <p class="text-subtitle1">Deploy your own Token contract</p>
    <p v-if="contractAddress">Success!</p>
    <p>{{ contractAddress }}</p>
  </div>

  <div class="flex column flex-center">
    <form
      action="#"
    >
      <q-btn
        @click="deploy"
        :disabled="txPending"
      >
        {{txPending? "pending": "Deploy"}}
      </q-btn>
    </form>

    <div class="text-red-6">
      {{ errMsg }}
    </div>
  </div>
</template>
