<template>
  <div :id="id" class="player" style="width: 100%; height: 100%"  ref="container"></div>
</template>

<script>
  //引入播放组件Jessibuca
  import Jessibuca from '@/components/Jessibuca/jessibuca.js'
  import {
    uploadScreenShot
  } from '@/api/wcs/deviceBaseInfo'
  // import Decoder from '@/components/Jessibuca/decoder.js'
  export default {
    props: {
      id: {
        type: String,
        default: "tc-player",
      },
      idx: {
        type: String
      },
      width: {
        type: [Number, String],
        default: "100%",
      },
      height: {
        type: [Number, String],
        default: "100%",
      },
      listener: {
        type: Function,
        default() {
          return function (msg) {};
        },
      },
      live: {
        type: Boolean,
        default: true,
      },
      autoplay: {
        type: Boolean,
        default: true,
      },
      src: {
        type: String,
        default: "",
      },
      options: {
        type: Object,
      },
    },
    data() {
      return {
        jessibuca: null,
        version: '',
        wasm: false,
        vc: "ff",
        quieting: true,
        showOperateBtns: false,
        showBandwidth: false,
        err: "",
        speed: 0,
        performance: "",
        volume: 1,
        rotate: 0,
        recordType: 'webm',
        scale: 0,
        url: this.src,
        data: null,
        isNotMute: false
      };
    },
    mounted() {
      window.$vueObj = this
      // this.create();
      // window.onerror = (msg) => (this.err = msg);
      // this.jessibuca.play("https://flvplayer.js.org/assets/video/weathering-with-you.flv");

    },
    unmounted() {
      this.jessibuca.destroy();
    },
    methods: {
      load(src,data) {
        this.data = data
        this.url = src;
        this.create()
      },
      create(options) {
        options = options || {};
        this.jessibuca = new Jessibuca(
          Object.assign(
            {
              container: this.$refs.container,
              videoBuffer: Number(0.2), // 缓存时长
              isResize: false,
              useWCS: this.useWCS,
              useMSE: this.useMSE,
              text: "",
              // background: "bg.jpg",
              loadingText: "加载中...",
              // hasAudio:false,
              debug: false,
              decoder: "/decoder.js",
              supportDblclickFullscreen: true,
              showBandwidth: true, // 显示网速
              operateBtns: {
                fullscreen: true,
                screenshot: true,
                play: true,
                audio: true,

              },
              vod: this.vod,
              forceNoOffscreen: !this.useOffscreen,
              isNotMute: this.isNotMute,
              timeout: 10
            },
            options
          )
        );

        var _this = this;
        this.jessibuca.on("load", function () {});

        this.jessibuca.on("log", function (msg) {});

        this.jessibuca.on("record", function (msg) {
          console.log("on record:", msg);
        });

        this.jessibuca.on("pause", function () {
          // _this.playing = false;
        });

        this.jessibuca.on("fullscreen", function (msg) {});

        this.jessibuca.on("mute", function (msg) {
          _this.quieting = msg;
        });

        this.jessibuca.on("audioInfo", function (msg) {
          // console.log("audioInfo", msg);
        });

        // this.jessibuca.on("bps", function (bps) {
        //   // console.log('bps', bps);
        // });
        // let _ts = 0;
        // this.jessibuca.on("timeUpdate", function (ts) {
        //     console.log('timeUpdate,old,new,timestamp', _ts, ts, ts - _ts);
        //     _ts = ts;
        // });

        this.jessibuca.on("videoInfo", function (info) {
          // console.log("videoInfo", info);
        });

        this.jessibuca.on("error", function (error) {
          _this.$message.error("获取视频错误");
        });

        this.jessibuca.on("timeout", function () {
          _this.$message.error("获取视频超时");
        });

        this.jessibuca.on('start', function () {
          // console.log('frame start');
        })

        this.jessibuca.on("performance", function (performance) {
          var show = "卡顿";
          if (performance === 2) {
            show = "非常流畅";
          } else if (performance === 1) {
            show = "流畅";
          }
          _this.performance = show;
        });
        this.jessibuca.on('buffer', function (buffer) {
          // console.log('buffer', buffer);
        })

        this.jessibuca.on('stats', function (stats) {
          // console.log('stats', stats);
        })

        this.jessibuca.on('kBps', function (kBps) {
          // console.log('kBps', kBps);
        });

        this.jessibuca.on("play", () => {
          // this.playing = true;
          // this.loaded = true;
          _this.quieting = _this.jessibuca.isMute();
        });

        this.jessibuca.on('recordingTimestamp', (ts) => {
          // console.log('recordingTimestamp', ts);
        })

        this.jessibuca.play(this.url);
        setTimeout(() => {
          let blob = this.jessibuca.screenshot(this.idx, "blob")
          let formData = new FormData();
          let file = new File([blob], this.idx + '.png', {
            type: 'application/json',
            lastModified: Date.now()
          });
          formData.append("file", file);
          uploadScreenShot(formData)
        }, 3000)
        // console.log(this.jessibuca);
      },
      // play() {
      //   // this.jessibuca.onPlay = () => (this.playing = true);


      //   // if (this.$refs.playUrl.value) {
      //     // this.jessibuca.play(this.$refs.playUrl.value);
      //     this.jessibuca.play("https://flvplayer.js.org/assets/video/weathering-with-you.flv");
      //   // }
      // },
      mute() {
        // this.isNotMute = false
        //jessibuca.isMute()
        this.jessibuca.mute();
      },
      cancelMute() {
        // this.isNotMute = true
        this.jessibuca.cancelMute();
      },
      pause() {
        this.jessibuca.pause();
        // this.playing = false;
        this.err = "";
        this.performance = "";
      },
      volumeChange() {
        this.jessibuca.setVolume(this.volume);
      },
      rotateChange() {
        this.jessibuca.setRotate(this.rotate);
      },
      destroy() {
        if (this.jessibuca) {
          this.jessibuca.destroy();
        }
        this.create();
        // this.playing = false;
        // this.loaded = false;
        this.performance = "";
      },
      fullscreen() {
        if (!this.jessibuca) return;
        return this.jessibuca.setFullscreen(true);
      },
      clearView() {
        this.jessibuca.clearView();
      },
      close() {
        if (!this.jessibuca) return;
        return this.reset();
      },
      // startRecord() {
      //   const time = new Date().getTime();
      //   this.jessibuca.startRecord(time, this.recordType);
      // },

      // stopAndSaveRecord() {
      //   this.jessibuca.stopRecordAndSave();
      // },
      reset() {
        if (this.jessibuca) {
          this.jessibuca.destroy()
        }
        this.jessibuca = null;
        this.url = "";
      },
      screenShot() {
        this.jessibuca.screenshot();
      },
      status() {
        return this.jessibuca && this. jessibuca.isPlaying();
      }
    },
  };
</script>

<style lang="scss" scoped>
  .player {
    background: center center no-repeat #353535;
    background-size: 60px 60px;
  }
</style>


