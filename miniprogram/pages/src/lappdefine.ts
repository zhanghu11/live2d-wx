         import { LogLevel } from '../src1/live2dcubismframework';
         
        //  export const ModelDir: string[] = ['Haru'];// 旧模型
        //  export const scale1:number=2;
        //  export const translate1:{x:number,y:number}={x:-0.2,y:-1};
        export const ModelDir: string[] = ['Haru'];// 新模型
        export const scale1:number=1;
        export const translate1:{x:number,y:number}={x:-0.0,y:0};    
            
        export const ModelDirSize: number = ModelDir.length;
         /**
          * Sample Appで使用する定数
          */
         const windowInfo = wx.getWindowInfo()
         // Canvas width and height pixel values, or dynamic screen size ('auto').
         export const CanvasSize: { width: number; height: number } | 'auto' = {
             width:windowInfo.screenWidth,
             height: windowInfo.screenHeight,
           };
         
         // 画面
         export const ViewScale = 1.0;
         export const ViewMaxScale = 2.0;
         export const ViewMinScale = 0.8;
         
         export const ViewLogicalLeft = -1.0;
         export const ViewLogicalRight = 1.0;
         export const ViewLogicalBottom = -1.0;
         export const ViewLogicalTop = 1.0;
         
         export const ViewLogicalMaxLeft = -2.0;
         export const ViewLogicalMaxRight = 2.0;
         export const ViewLogicalMaxBottom = -2.0;
         export const ViewLogicalMaxTop = 2.0;
         
         // 相対パス
         export const ResourcesPath = 'https://txcj.oss-cn-beijing.aliyuncs.com/live2d/';// / 可以放到你的cdn https://txcj.oss-cn-beijing.aliyuncs.com/live2d/ 模型文件和图片都要放到里面
          
         // モデルの後ろにある背景の画像ファイル
         export const BackImageName = '';
         
         // 歯車
         export const GearImageName = 'icon_gear.png';
         
         // 終了ボタン
         export const PowerImageName = 'CloseNormal.png';
         
         // モデル定義---------------------------------------------
         // モデルを配置したディレクトリ名の配列
         // ディレクトリ名とmodel3.jsonの名前を一致させておくこと

         
         // 外部定義ファイル（json）と合わせる
         export const MotionGroupIdle = 'Idle'; // アイドリング
         export const MotionGroupTapBody = 'TapBody'; // 体をタップしたとき
         
         // 外部定義ファイル（json）と合わせる
         export const HitAreaNameHead = 'Head';
         export const HitAreaNameBody = 'Body';
         
         // モーションの優先度定数
         export const PriorityNone = 0;
         export const PriorityIdle = 1;
         export const PriorityNormal = 2;
         export const PriorityForce = 3;
         
         // デバッグ用ログの表示オプション
         export const DebugLogEnable = true;
         export const DebugTouchLogEnable = false;
         
         // Frameworkから出力するログのレベル設定
         export const CubismLoggingLevel: LogLevel = LogLevel.LogLevel_Verbose;
         
         // デフォルトのレンダーターゲットサイズ
         export const RenderTargetWidth = 1900;
         export const RenderTargetHeight = 1000;