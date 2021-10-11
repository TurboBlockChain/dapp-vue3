<template>
  <div class="text-center">
    <div class="text-primary text-h5 q-fw-600 q-my-5">404</div>
    <div class="text-h6s text-gray-500 q-my-5">Oops. Page not found...</div>
    <div class="flex flex-row justify-center q-gap-4">
      <q-btn color="primary"
        @click="routerGo(-1)"
      >Back</q-btn>
      <q-btn color="secondary"
        @click="routerPush('/')"
      >Home</q-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Error404",
  setup() {
    const router = useRouter();
    return { routerPush: router.push, routerGo: router.go };
  },
});
</script>
