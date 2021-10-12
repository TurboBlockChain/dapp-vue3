<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import useMetaMask from "../composables/metamask";
import NETWORK from "../constants";

const tabList = [
  {
    name: 'Greeting',
    label: 'Greeting',
    href: "/greeting/home",
    navigation : [
      { name: "Home", href: "/greeting/home" },
      { name: "Deploy", href: "/greeting/deploy" },
      { name: "Contract", href: "/greeting/contract" },
    ]
  },
  {
    name: 'Token',
    label: 'Token',
    href: "/token/home",
    navigation : [
      { name: "Home", href: "/token/home" },
      { name: "Deploy", href: "/token/deploy" },
      { name: "Contract", href: "/token/contract" },
    ]
  }
]

export default defineComponent({
  name: "LayoutHeader",
  setup() {
    const {
      userAddress,
      connectWallet,
      chainId,
      isConnected,
      isSupportedNetwork,
      hasSetupWallet,
    } = useMetaMask();

    const displayUserAddress = computed(() => {
      return (
        userAddress.value.slice(0, 6) + "..." + userAddress.value.slice(-4)
      );
    });
    const       tab = ref('Greeting');
    return {
      displayUserAddress,
      isSupportedNetwork,
      chainName: computed(() => NETWORK(chainId.value)?.name), // note: must use computed
      connectWallet,
      isConnected,
      hasSetupWallet,
      tab,
      tabList
    };
  },
});
</script>

<template>
  <header class="bg-white">
    <q-toolbar class="bg-purple text-white shadow-2">
      <router-link to="/">
        <img
            class="q-h-50"
            src="../assets/logo.png"
            alt="logo"
        />
      </router-link>
      <q-space />
      <q-tabs v-model="tab" shrink stretch>
        <q-tab :name="item.name" :label="item.label" v-for="item in tabList" :key="item.name" @click="$router.push(item.href)"/>
      </q-tabs>
      <div class="flex items-center">
        <div
            v-if="!isSupportedNetwork"
            class="flex items-center"
        >
          <div class="text-gray-500"> <span class="uppercase">{{ chainName }}</span> is unsupported network</div>
        </div>
        <div
            v-else-if="isConnected() && hasSetupWallet"
            class="flex items-center"
        >
          <q-btn>{{ chainName }}</q-btn>
          <q-btn>{{ displayUserAddress }}</q-btn>
        </div>
        <button
            v-else
            @click="connectWallet"
            class="sm:text-xl sm:px-6 sm:py-3 rounded inline-block bg-blue-100 text-gray-600 cursor-pointer hover:bg-blue-200 focus:outline-none"
        >Connect Wallet</button>
      </div>

    </q-toolbar>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel :name="item.name" v-for="item in tabList" :key="item.name">
        <q-tabs>
          <q-route-tab
              v-for="link in item.navigation"
              :key="link.name"
              :to="link.href"
              :label="link.name"
          />
        </q-tabs>
      </q-tab-panel>
    </q-tab-panels>
  </header>
</template>

