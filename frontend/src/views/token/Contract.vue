<script lang="ts">
import { defineComponent, ref } from "vue";
import useMetaMask from "@/composables/metamask";
import {useGetBalanceOf, useTokenContract} from "@/composables/token";

export default defineComponent({
  name: "token-contract",
  setup() {
    const {
      userAddress,
      connectWallet,
      chainId,
      isConnected,
      isSupportedNetwork,
      hasSetupWallet,
      etherBalance, connectError
    } = useMetaMask();
    const { connectContractAt } = useTokenContract();
    const { balance, getBalance } = useGetBalanceOf();
    const addressInput = ref("");
    const errMsg = ref("");
    const deployPending = ref(false);

    const connectContractBtn = async () => {
      errMsg.value = "";

      try {
        deployPending.value = true;
        const _token = connectContractAt(addressInput.value)!;
        await _token.deployed();
        await getBalance(_token, userAddress.value)
      } catch (e) {
        errMsg.value = e.message;
      } finally {
        deployPending.value = false;
      }
    };

    return {
      etherBalance,
      connectError,
      addressInput,
      errMsg,
      deployPending,
      connectContractBtn,
      balance,
    };
  },
});
</script>

<template>
  <div class="text-center text-gray-6">
    <p class="text-red-6">{{ connectError }}</p>
    <p class="text-body1">Connect to your own Token contract</p>
    <p>ETH: {{ etherBalance }}</p>
    <p>Token: {{ balance }}</p>
  </div>

  <div class="flex justify-center">
    <div class="q-pa-8 q-pb-4">
      <label
        for="ContractAddress"
        class="block q-mt-2 text-subtitle1 text-weight-medium text-gray-6"
      >Contract Address</label>
      <div class="flex justify-between">
        <q-input
          v-model="addressInput"
          id="ContractAddress"
          type="ContractAddress"
          name="ContractAddress"
          dense
          outlined
          placeholder="0x..."
          autocomplete="ContractAddress"
          required
        />
        <q-btn
          @click="connectContractBtn()"
          :disable="deployPending"
        >        {{deployPending? "pending": "Connect"}}
        </q-btn>
      </div>
    </div>
  </div>
  <p class="q-pa-4 text-center text-red-6"> {{ errMsg }} </p>
</template>
