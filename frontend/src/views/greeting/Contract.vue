<script lang="ts">
import { defineComponent, ref } from "vue";
import useMetaMask from "@/composables/metamask";
import { useGetGreeting, useGreeterContract } from "@/composables/greeter";
import { Greeter as IGreeter } from "@dapp-vue3/contracts/typechain/Greeter";
import useGreeterStore from "@/store/greeter";
import Greeter from "@/components/Greeter.vue";

export default defineComponent({
  components: { Greeter },
  name: "greeting-contract",
  setup() {
    const { etherBalance, connectError } = useMetaMask();
    const { connectContractAt } = useGreeterContract();
    const { greeting, getGreeting } = useGetGreeting();
    const { greeters, addGreeter } = useGreeterStore();

    const greeter = ref<IGreeter>();

    const addressInput = ref("");
    const errMsg = ref("");
    const deployPending = ref(false);

    const connectContractBtn = async () => {
      errMsg.value = "";

      try {
        deployPending.value = true;
        const _greeter = connectContractAt(addressInput.value);
        await _greeter?.deployed();
        await getGreeting(_greeter!);
        addGreeter({
          address: _greeter!.address,
          greeter: _greeter!,
          greeting: greeting.value!,
        });
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
      greeter,
      greeting,
      greeters,
      errMsg,
      deployPending,
      connectContractBtn,
    };
  },
});
</script>

<template>
  <div class="text-center text-gray-6">
    <p class="text-red-6">{{ connectError }}</p>
    <p class="text-body1">Connect to your own Greeter contract</p>
    <p>ETH: {{ etherBalance }}</p>
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
        >Connect</q-btn>
      </div>
    </div>
  </div>
  <p class="q-pa-4 text-center text-red-6"> {{ errMsg }} </p>

  <!-- Greeter Contracts -->
  <div
    v-for="(greeter, i) in greeters"
    :key="i"
  >
    <greeter :greeterData="greeter" />
  </div>
</template>
