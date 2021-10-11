<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { useGetGreeting, useSetGreeting } from "../composables/greeter";
import useGreeterStore from "../store/greeter";

export default defineComponent({
  props: {
    greeterData: {
      type: Object,
    },
  },
  setup(props) {
    const { getGreeting, greeting } = useGetGreeting();
    const { setGreeting, errMsg, isPending } = useSetGreeting();
    const { updateGreeting } = useGreeterStore();

    const greetingInput = ref("");

    async function setGreetingBtn() {
      await setGreeting(props.greeterData?.greeter!, greetingInput.value);
      greetingInput.value = "";
      await getGreeting(props.greeterData?.greeter!);
      updateGreeting(props.greeterData?.address!, greeting.value);
    }

    const displayAddress = (address: string) => {
      return address ? address.slice(0, 6) + "..." + address.slice(-4) : "";
    };
    return { greetingInput, isPending, errMsg, setGreetingBtn, displayAddress };
  },
});
</script>


<template>
  <div class="flex flex-center">
    <div>
      <div class="text-center q-pa-2">
        {{ displayAddress(greeterData?.address ?? "") }}
        <p>Greeting: {{ greeterData?.greeting }}</p>
      </div>

      <div class="flex justify-between gap-3">
        <span class="full-width">
          <label
            :for="greeterData?.address"
            class="block text-subtitle1 text-weight-medium text-gray-6"
          >Greeting</label>
          <q-input
            :id="greeterData?.address"
            dense
            outlined
            name="Greeting"
            placeholder="Hello World"
            v-model="greetingInput"
            type="text"
            required
          />
        </span>
      </div>
      <q-btn
        @click="setGreetingBtn()"
        class="q-my-4"
        :disabled="isPending"
      >{{ isPending ? "pending" : "setGreeting" }}</q-btn>
    </div>

    <p class="p-4 text-center text-red-600"> {{ errMsg }} </p>
  </div>
</template>
