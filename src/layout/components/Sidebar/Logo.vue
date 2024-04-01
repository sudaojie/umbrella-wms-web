<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}" :style="{ backgroundColor: sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground }">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo" style="display: none" />
        <h1 v-else class="sidebar-title" :style="{ color: sideTheme === 'theme-dark' ? variables.logoTitleColor : variables.logoLightTitleColor }">{{ title }} 1</h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo" style="display: none" />
        <h1 class="sidebar-title" :style="{ color: sideTheme === 'theme-dark' ? variables.logoTitleColor : variables.logoLightTitleColor }">{{ title }} </h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
  import logoImg from '@/assets/logo/login_logo.png'
  import variables from '@/assets/styles/variables.scss'

  export default {
    name: 'SidebarLogo',
    props: {
      collapse: {
        type: Boolean,
        required: true
      }
    },
    computed: {
      variables() {
        return variables;
      },
      sideTheme() {
        return this.$store.state.settings.sideTheme
      }
    },
    data() {
      return {
        title:process.env.VUE_APP_TITLE,
        logo: logoImg
      }
    }
  }
</script>

<style lang="scss" scoped>
  .sidebarLogoFade-enter-active {
    transition: opacity 1.5s;
  }

  .sidebarLogoFade-enter,
  .sidebarLogoFade-leave-to {
    opacity: 0;
  }

  .sidebar-logo-container {
    position: relative;
    width: 100%;
    padding-top: 20px;
    padding-bottom: 10px;
    background: #2b2f3a;
    text-align: center;
    overflow: hidden;
    & .sidebar-logo-link {
      height: 100%;
      width: 100%;

      & .sidebar-logo {
        width: 45px;
        height: 24px;
        vertical-align: middle;
        margin-right: 5px;
      }

      & .sidebar-title {
        display: block;
        margin: 0;
        color: #fff!important;
        font-weight: 600;
        position: relative;
        line-height: 25px;
        font-size: 16px;
        font-family: Avenir,Helvetica Neue,Arial,Helvetica,sans-serif;
        vertical-align: middle;
      }
    }

    &.collapse {
      .sidebar-logo {
        margin-right: 0px;
      }
    }
  }
</style>
