<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { ContractFactory } from "ethers";
import useMetaMask from "@/composables/metamask";
import { useGreeterContract } from "@/composables/greeter";
import { Greeter } from "@dapp-vue3/contracts/typechain/Greeter";
import { GreeterFactory } from "@dapp-vue3/contracts/typechain/GreeterFactory";

export default defineComponent({
  name: "greeting-deploy",
  setup() {
    const { signer } = useMetaMask();
    const { contractData } = useGreeterContract();

    const param1 = ref("");
    const contractAddress = ref("");
    const errMsg = ref("");
    const txPending = ref(false);

    const deploy = async () => {
      errMsg.value = "";

      try {
        txPending.value = true;
        const greeterFactory = new ContractFactory(
          contractData.abi,
          contractData.bytecode,
          signer.value
        ) as GreeterFactory;
        const greeter = (await greeterFactory.deploy(param1.value)) as Greeter;
        await greeter.deployed();

        contractAddress.value = greeter.address;
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
    <p class="text-subtitle1">Deploy your own Greeter contract</p>
    <p v-if="contractAddress">Success!</p>
    <p>{{ contractAddress }}</p>
  </div>

  <div class="flex column flex-center">
    <form
      action="#"
    >
      <div class="flex justify-between q-gap-3">
        <span class="full-width">
          <label
            for="Greeting"
            class="block text-subtitle1 q-fw-600 text-gray-6"
          >Greeting</label>
          <q-input
            v-model="param1"
            outlined
            dense
            id="Greeting"
            type="text"
            name="Greeting"
            placeholder="Hello World"
          />
        </span>
      </div>
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
