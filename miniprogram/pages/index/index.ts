import { CanvasSize } from "../src/lappdefine";
import { LAppDelegate } from "../src/lappdelegate";
import { LAppLive2DManager } from "../src/lapplive2dmanager";
import CryptoJS from "crypto-js";
let live2DManager1: LAppLive2DManager;
const app = getApp<IAppOption>()
const fs = wx.getFileSystemManager();
let ws1: any;
let canvas: any;
let socketv1 = { state: false, state1: false, cont: 5 };
let time1 = new Date().getTime()
let time2 = new Date().getTime()
Page({
    data: {
        canvas: '',
        file: ["/Haru/expressions/F01.exp3.json"],
        text: "123"
    },

    onLoad() {

        // let arrayBuffer = fs.readFileSync(`${wx.env.USER_DATA_PATH}` + '/Haru/Haru.userdata3.json')
        // console.log(arrayBuffer)
        // this.data.file.forEach((name: any) => {
        //     this.file2(name);
        // });
        // return
        if (LAppDelegate.getInstance().initialize() == false) {
            console.log("虚拟人初始化失败");
        }
        let that = this
        wx.createSelectorQuery().select('#myCanvas').node(function (res) {
            canvas = res.node
            live2DManager1 = LAppLive2DManager.getInstance();
            that.loop()
        }).exec()

        // this.record()
        setTimeout(() => {
            live2DManager1.motion1(1, 2, this.Finished); //
        }, 3000);
    },
    loop() {
        if (socketv1.state1 == false) {
            socketv1.state1 = true;
            // this.socket();
        }
        LAppDelegate.getInstance().run();
        canvas.requestAnimationFrame(this.loop);
    },
    Finished() { },
    record() {
        let recorderManager = wx.getRecorderManager()
        recorderManager.onStart(() => {
            console.log('recorder start')
        })
        recorderManager.onFrameRecorded((res) => {
            time2 = new Date().getTime()
            // console.log(time2-time1)
            time1 = time2
            if (socketv1.state) {
                // console.log(res.frameBuffer)
                // console.log(new Int8Array(res.frameBuffer))
                let u8=new Int16Array(res.frameBuffer)
                // console.log(u8)
                ws1.send({ data: u8 })
            }
        })
        recorderManager.onStop((res)=>{
            const innerAudioContext = wx.createInnerAudioContext({
                useWebAudioImplement: true // 是否使用 WebAudio 作为底层音频驱动，默认关闭。对于短音频、播放频繁的音频建议开启此选项，开启后将获得更优的性能表现。由于开启此选项后也会带来一定的内存增长，因此对于长音频建议关闭此选项
              })
              innerAudioContext.src = res.tempFilePath
              innerAudioContext.play() // 播放
        })
        recorderManager.start({ duration: 60000, sampleRate: 16000, numberOfChannels: 1, encodeBitRate: 24000, format: 'PCM', frameSize: 1 });
        setTimeout(() => {
            // recorderManager.stop()
        }, 20000);
    },
    socket() {
        let BASE_URL = "wss://wsapi.xfyun.cn/v1/aiui";
        let APPID = "932dd34f";
        let APIKEY = "180af03f71f156ffacc5f4300c295be8";
        let PARAM1 =
            '{"auth_id":"18d75142a17112206fbfae54292901c8","data_type":"audio","scene":"main_box","sample_rate":"16000","vad_info":"end","tts_aue":"lame","aue":"raw","result_level":"complete","context":"{\\"sdk_support\\":[\\"tts\\"]}"}';
        let paramBase64 = this.base64_encode(PARAM1);
        let curtime = Math.floor(Date.now() / 1000);
        let originStr = APIKEY + curtime + paramBase64;
        let checksum = CryptoJS.MD5(originStr).toString();
        let handshakeParams =
            "?appid=" +
            APPID +
            "&checksum=" +
            checksum +
            "&curtime=" +
            curtime +
            "&param=" +
            paramBase64;
        ws1 = wx.connectSocket({
            url: BASE_URL + handshakeParams,
            success(res) {
                // console.log(res)

            }
        })
        ws1.onOpen(() => {
            socketv1.state = true
            console.log("链接成功")
        })
        ws1.onMessage(this.onMessage);
        ws1.onClose(() => {
            console.log("断开")
            socketv1.state = false;
            socketv1.state1 = false;
        })
    },
    onMessage(res: any) {
        this.setData({
            text: res.data
        })
        console.log(this.data.text)
        let data1 = JSON.parse(res.data);
        let data = data1.data;
        if (data.sub == "iat") {
            ws1.send(this.stringToArrayBuffer("--end--"));
            ws1.send("--end--");
        }
        if (data.sub == "nlp") {
            console.log(data.intent.answer)
            if (data.intent.answer == undefined) {
                return;
            }
        }
        if (data.sub == "tts") {
            console.log(data.content)
        }
    },


    stringToArrayBuffer(str: any) {
        var bytes = new Array();
        var len, c;
        len = str.length;
        for (var i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if (c >= 0x010000 && c <= 0x10FFFF) {
                bytes.push(((c >> 18) & 0x07) | 0xF0);
                bytes.push(((c >> 12) & 0x3F) | 0x80);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            } else if (c >= 0x000800 && c <= 0x00FFFF) {
                bytes.push(((c >> 12) & 0x0F) | 0xE0);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            } else if (c >= 0x000080 && c <= 0x0007FF) {
                bytes.push(((c >> 6) & 0x1F) | 0xC0);
                bytes.push((c & 0x3F) | 0x80);
            } else {
                bytes.push(c & 0xFF);
            }
        }

        var array = new Int8Array(bytes.length + 10);
        //包头
        array[0] = 239;
        array[1] = 207;
        array[2] = 254;
        array[3] = 252;
        //包长
        var leng = 2 + bytes.length;
        console.log('leng=' + leng)

        if (leng <= 255) {
            array[4] = leng;
            array[5] = 0;
            array[6] = 0;
            array[7] = 0;
        } else {
            array[4] = leng % 256;
            array[5] = Math.floor(leng / 256);
            array[6] = 0;
            array[7] = 0;
        }
        //版本号
        array[8] = 0;
        array[9] = 1;
        //内容
        for (var i = 0; i <= bytes.length; i++) {
            array[i + 10] = bytes[i];
        }
        return array.buffer;
    },
    base64_encode(str: any) {
        var c1, c2, c3;
        var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var i = 0, len = str.length, string = '';

        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                string += base64EncodeChars.charAt(c1 >> 2);
                string += base64EncodeChars.charAt((c1 & 0x3) << 4);
                string += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
                string += base64EncodeChars.charAt(c1 >> 2);
                string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                string += base64EncodeChars.charAt((c2 & 0xF) << 2);
                string += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            string += base64EncodeChars.charAt(c1 >> 2);
            string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            string += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            string += base64EncodeChars.charAt(c3 & 0x3F)
        }
        return string
    },
    async file2(name: any) {
        await this.file1(name);
    },
    file1(name: string) {
        return new Promise(resolve => {
            // console.log('https://txcj.oss-cn-beijing.aliyuncs.com/live2d' + name)
            wx.downloadFile({
                url: 'https://txcj.oss-cn-beijing.aliyuncs.com/live2d',
                filePath: `${wx.env.USER_DATA_PATH}` + name,
                success(res) {
                    resolve(0)
                }
            })
        });

    },

    bindtouchstart(e: any) {
        if (!LAppDelegate.getInstance()._view) {
            return;
        }
        LAppDelegate.getInstance()._captured = true;
        const posX = e.changedTouches[0].x;
        const posY = e.changedTouches[0].y;
        LAppDelegate.getInstance()._view.onTouchesBegan(posX, posY);
    },
    bindtouchmove(e: any) {
        if (!LAppDelegate.getInstance()._captured) {
            return;
        }
        if (!LAppDelegate.getInstance()._view) {
            return;
        }
        let posX = e.changedTouches[0].x;
        let posY = e.changedTouches[0].y;
        LAppDelegate.getInstance()._view.onTouchesMoved(posX, posY);
    },
    bindtouchend(e: any) {
        LAppDelegate.getInstance()._captured = false;
        if (!LAppDelegate.getInstance()._view) {
            return;
        }
        const posX = e.changedTouches[0].pageX;
        const posY = e.changedTouches[0].pageX;
        LAppDelegate.getInstance()._view.onTouchesEnded(posX, posY);
    }
})
