<template>
  <div class="bigScreen">
    <div class="bg">
      <img src="@/assets/img/bigScreen/bg.gif" alt="" />
    </div>
    <div class="bigScreenTop">
      <BigScreenTop :videoTime="videoTime"></BigScreenTop>
    </div>
    <div class="bigScreenCenter">
      <BigScreenCenter
        @chaneVidoe="chaneVidoe"
        :camerList="camerList"
        :cameraId="cameraId"
        :cameraInfo="cameraInfo"
        :listData="cameraListData"
        :alarmMap="alarmMap"
        :videoTime="videoTime"
      ></BigScreenCenter>
    </div>
    <div class="bigScreenBottom">
      <BigScreenBottom
        @change="changeAlarmImage"
        :alarmCacle="alarmCacle"
        :faceRecognition="faceRecognition"
        :faceCapturing="faceCapturing"
      ></BigScreenBottom>
    </div>
  </div>
</template>

<script>
import BigScreenTop from './bigScreenTop.vue'
import BigScreenCenter from './bigScreenCenter.vue'
import BigScreenBottom from './bigScreenBottom.vue'
import {
  getCameraApi,
  getAlgorithmListApi,
  wsPreview,
  getAlarmInfoCountApi,
  getDatetimeApi,
} from '@/api/article'
import { flvJoin } from '@/utils/videoJoin'
import { changeImge } from '@/utils/utils'
export default {
  components: {
    BigScreenTop,
    BigScreenCenter,
    BigScreenBottom,
  },
  data() {
    return {
      cameraId: '',
      cameraListData: [],
      camerList: [],
      alarmMap: {},
      alarmCacle: [],
      faceRecognition: [],
      faceCapturing: [],
      ws: null,
      videoWidth: 0,
      videoHeight: 0,
      imgWidth: 0,
      imgheight: 0,
      videoTime: '',
      Vtimer: null,
      alarmImageShow: false, //是否开始展示发送的报警图片，因为有的时候报警名字还没加载完就出报警图片，会出现暂无的情况
    }
  },
  beforeDestroy() {
    this.ws && this.ws.close()
    this.Vtimer && clearInterval(this.Vtimer)
    window.removeEventListener('resize', this.resizeWidth)
  },
  mounted() {
    this.getAlgorithmList()
    this.getCamera()
    this.initWs()
    this.getTime()
    this.resizeWidth()
    window.addEventListener('resize', this.resizeWidth)
  },
  computed: {
    cameraInfo() {
      var camera = this.camerList.find(
        (item) => item.channelId == this.cameraId
      )
      var url = ''
      if (camera && camera.url) {
        url = camera.url
      }
      return { url, ...camera }
    },
  },
  methods: {
    resizeWidth() {
      setTimeout(() => {
        var playerVideo = document.getElementById('playerVideo')
        if (playerVideo) {
          this.videoWidth = playerVideo.offsetWidth
          this.videoHeight = playerVideo.offsetHeight
          var fontSize = document.querySelector('html').style.fontSize
          fontSize = Number(fontSize.replace('px', ''))
          this.imgWidth = 3.44 * fontSize
          this.imgheight = 1.93 * fontSize
        }
      }, 50)
    },
    getTime() {
      //获取系统时间
      getDatetimeApi({}).then((res) => {
        if (JSON.parse(res.data)[0]) {
          this.videoTime = JSON.parse(res.data)[0].dateTime
          this.Vtimer = setInterval(() => {
            this.videoTime = new Date(
              new Date(this.videoTime).getTime() + 1000
            ).format('yyyy-MM-dd hh:mm:ss')
          }, 1000)
        }
      })
    },
    getAlarmInfoCount() {
      /**获取今日报警数据统计 */
      getAlarmInfoCountApi({})
        .then((res) => {
          if (res.code == 0) {
            if (res.data) {
              try {
                var data = JSON.parse(res.data)
                data.forEach((element) => {
                  if (this.alarmMap[element.AlarmType]) {
                    this.$set(
                      this.alarmMap[element.AlarmType],
                      'count',
                      Number(element.Count)
                    )
                  }
                })
              } catch (error) {
                console.log(error)
              }
            }
          }
        })
        .catch((err) => {})
    },
    chaneVidoe(data) {
      var index = 0
      var camerList = this.camerList
      this.cameraListData = []
      for (let i = 0; i < camerList.length; i++) {
        const element = camerList[i]
        if (element.channelId == this.cameraId) {
          index = i
          break
        }
      }
      //切换视频
      if (data == 'left') {
        index--
        if (index < 0) {
          for (let i = 0; i < camerList.length; i++) {
            const element = camerList[i]
            if (!element.channelId) {
              index = i - 1
              break
            }
          }
          this.cameraId = camerList[index].channelId
        } else {
          this.cameraId = camerList[index].channelId
        }
      } else {
        index++
        if (index >= camerList.length || !camerList[index].channelId) {
          this.cameraId = camerList[0].channelId
        } else {
          this.cameraId = camerList[index].channelId
        }
      }
    },
    changeAlarmImage() {
      this.alarmCacle.shift()
    },
    initWs() {
      this.ws = wsPreview(
        (data) => {
          if (data.Cmd == 'Detection') {
            var xinxi = JSON.parse(data.Data)
            for (let i = 0; i < xinxi.listData.length; i++) {
              if (xinxi.listData[i].alarmType != 0) {
                xinxi.listData[i].lineColor = '#ff0000'
                xinxi.listData[i].titleColor = '#ff0000'
              }
              xinxi.listData[i].modeType = 'react'
              xinxi.listData[i].title = xinxi.listData[i].id
            }
            if (this.cameraId == xinxi.channelId) {
              this.cameraListData = changeImge(
                JSON.parse(JSON.stringify(xinxi.listData)),
                this.videoWidth,
                this.videoHeight
              )
            }
          } else if (data.Cmd == 'AlarmTrigger') {
            if (this.alarmImageShow) {
              //当加载完报警名字在开始触发报警图片
              var obj = JSON.parse(data.Data)
              console.log('🤡 ~~ obj', obj)
              obj.ImageUrl =
                (process.env.NODE_ENV == 'dev'
                  ? process.env.VUE_APP_URL.replace(':8183', '')
                  : window.location.origin) + obj.ImageUrl
              if (obj.listData.length > 0) {
                obj.yanListData = JSON.parse(JSON.stringify(obj.listData))
                obj.listData = changeImge(
                  JSON.parse(JSON.stringify(obj.listData)),
                  this.imgWidth,
                  this.imgheight
                )
                var AlarmName = this.getAlarmName(obj.listData[0].alarmType, 1)
                  const { name } =
              this.camerList.find((item) => item.channelId === obj.channelId) || {}
                var obj = {
                  name: '暂无',
                  channelName:name,
                  url: obj.ImageUrl,
                  id: new Date().getTime() + '',
                  listData: obj.listData,
                  time: obj.Time.slice(0, -4),
                  yanListData: obj.yanListData,
                }
                if (AlarmName) {
                  obj.name = AlarmName
                }

                this.alarmCacle.push(obj)
                if (obj.listData[0].alarmType === '400') {
                  if (this.faceCapturing.length >= 5) {
                    this.faceCapturing.shift()
                  }
                  this.faceCapturing.push(obj)
                }
              }
            }
          } else if (data.Cmd == 'FaceAlarm') {
            const ImageUrl =
              process.env.NODE_ENV == 'dev'
                ? process.env.VUE_APP_URL.replace(':8183', '')
                : window.location.origin
            const obj = JSON.parse(data.Data)
            const {
              CameraId,
              FaceUrl,
              FaceSnap,
              time,
              FaceThreshold,
              PersonName,
            } = obj
            const { name } =
              this.camerList.find((item) => item.channelId === CameraId) || {}
            if (this.faceRecognition.length >= 2) {
              this.faceRecognition.shift()
            }
            this.faceRecognition.push({
              FaceUrl: ImageUrl + FaceUrl,
              FaceSnap: ImageUrl + FaceSnap,
              CameraId,
              time: time.slice(0, -4),
              FaceThreshold: (FaceThreshold * 100).toFixed(0) + '%',
              name,
              PersonName,
            })
          }
        },
        {
          info: ['Detection', 'AlarmTrigger', 'FaceAlarm'],
        }
      )
    },
    getAlarmName(alarmNumber, count) {
      var str = ''
      if (this.alarmMap[alarmNumber]) {
        if (count) {
          this.$set(
            this.alarmMap[alarmNumber],
            'count',
            this.alarmMap[alarmNumber].count + count
          )
        }
        str = this.alarmMap[alarmNumber].name
      }
      return str
    },
    getAlgorithmList() {
      getAlgorithmListApi({}).then((res) => {
        if (res.code == 0) {
          var data = JSON.parse(res.data)
          if (data && data.length > 0) {
            data.forEach((element) => {
              this.$set(this.alarmMap, element.alarmNumber, {
                path: element.path,
                name: element.name,
                count: 0,
              })
            })
            this.alarmImageShow = true
            this.getAlarmInfoCount()
          }
        }
      })
    },
    getCamera() {
      getCameraApi({})
        .then((res) => {
          if (res.code == 0) {
            if (res.data) {
              this.camerList = JSON.parse(res.data).map((item) => {
                item.url = flvJoin(item)
                return item
              })
              if (this.camerList.length < 6) {
                for (let i = this.camerList.length - 1; i < 5; i++) {
                  this.camerList.push({
                    name: '待接入',
                  })
                }
              }
              if (this.camerList[0].channelId) {
                this.cameraId = this.camerList[0].channelId
              }
            }
            // this.initWs();
          }
        })
        .catch((err) => {
          this.camerList = [
            {
              name: '待接入',
            },
            {
              name: '待接入',
            },
            {
              name: '待接入',
            },
            {
              name: '待接入',
            },
            {
              name: '待接入',
            },
            {
              name: '待接入',
            },
          ]
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.bigScreen {
  position: relative;
  width: 19.2rem;
  min-height: 100vh;
  background-color: #040d54;
  line-height: 0.22rem;
  user-select: none;
  .bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    min-height: 100vh;
    img {
      display: block;
      width: 100%;
      //   height: 100%;
    }
    // z-index: -1;
  }
  .bigScreenTop {
    height: 0.93rem;
  }
  .bigScreenCenter,
  .bigScreenBottom,
  .bigScreenTop {
    position: relative;
    width: 18.6rem;
    margin: 0 auto;
  }
  .bigScreenCenter {
    margin-top: 0.08rem;
    height: 6.5rem;
    z-index: 5;
  }
  .bigScreenBottom {
    margin-top: 0.18rem;
    height: 2.75rem;
  }
}
</style>
