<template>
   <div class="operation-button">
       <div class="operation-center" :class="{active:shows==1}" @click="mainInterface()">主界面</div>
       <div class="operation-center" :class="{active:shows==2}" @click="tallyArea()">理货区</div>
       <div class="operation-center" :class="{active:shows==3}" @click="dryingArea()">晾晒区</div>
   </div>
</template>
<script>
export default {
  data() {
    return {
      shows:1
    }
  },
  mounted() {
  },
  methods: {
    mainInterface() {
      this.$parent.$parent.$refs.iframeDom.contentWindow.send(113)
      this.shows = 1;
    },
    tallyArea() {
      this.$parent.$parent.$refs.iframeDom.contentWindow.send(114)
      this.shows = 2;
    },
    dryingArea() {
      this.$parent.$parent.$refs.iframeDom.contentWindow.send(115)
      this.shows = 3;
    },
  }
}
</script>
<style scoped>
.operation-button {
  position: absolute;
  bottom: 14%;
  left: 50%;
  display: flex;
  margin-left: -200px;
}

.operation-button .operation-center {
  width: 100px;
  height: 40px;
  line-height: 40px;
  margin: 0 10px;
  background: rgba(30, 34, 35, 0.6);
  border-radius: 10px;
  text-align: center;
  color: #ABFFF7;
  font-size: 14px;
  cursor: pointer;
}
.operation-button .operation-center:hover{
  background: rgba(30, 34, 35, 0.8);
  color: #fff;
}
.active{
  background: rgba(30, 34, 35, 0.8);
  color: #fff;
}
</style>
