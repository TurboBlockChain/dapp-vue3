<script lang="ts">
import { defineComponent, ref } from "vue";
import useMetaMask from "@/composables/metamask";
import {
  useGetGreeting,
  useGreeterContract,
  useSetGreeting,
} from "@/composables/greeter";

export default defineComponent({
  name: "greeting-home",
  setup() {
    const { etherBalance, connectError } = useMetaMask();
    const { greeter, greeting: greetingStore } = useGreeterContract();
    const { setGreeting, errMsg, isPending } = useSetGreeting();
    const { getGreeting, greeting } = useGetGreeting();

    const greetInput = ref("");

    const setGreetingBtn = async () => {
      await setGreeting(greeter.value!, greetInput.value);
      greetInput.value = "";
      await getGreeting(greeter.value!);
      greetingStore.value = greeting.value;
    };

    return {
      errMsg,
      greeting: greetingStore,
      greetInput,
      etherBalance,
      connectError,
      isPending,
      setGreetingBtn,
    };
  },
});
</script>

<template>
  <div class="text-center text-gray-600">
    <p class="text-red-600">{{ connectError }}</p>
    <p class="text-h6">Greeter</p>
    <p>ETH: {{ etherBalance }}</p>
    <p>Greeting: {{ greeting }}</p>

  </div>

  <div class="flex flex-center">
    <div class="flex column q-gap-10">
      <div class="flex justify-between q-gap-3">
        <span class="full-width">
          <label
            for="Greeting"
            class="block text-body2 text-gray-6"
          >Greeting</label>
          <q-input
            id="Greeting"
            name="Greeting"
            outlined
            dense
            placeholder="Hello World"
            @keyup.enter="setGreetingBtn()"
            v-model="greetInput"
            type="text"
            required
          />
        </span>
      </div>
      <q-btn
          color="primary"
        @click="setGreetingBtn()"
        :disabled="isPending"
      >{{ isPending ? "pending" : "setGreeting" }}</q-btn>
    </div>
  </div>
  <p class="q-p-10 text-center text-red-6"> {{ errMsg }} </p>
</template>
