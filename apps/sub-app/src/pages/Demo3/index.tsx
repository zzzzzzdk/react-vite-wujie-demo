import { useEffect } from 'react';

const Demo3 = () => {
  useEffect(() => {
    console.log(window.$wujie, 'window.$wujie');

    // 子应用监听事件
    window.$wujie?.bus.$on('userInfo', function (arg: any) {
      console.log(arg, 'arg');
    });
    // // 子应用发送事件
    // window.$wujie?.bus.$emit("事件名字", arg1, arg2, ...);
    // // 子应用取消事件监听
    // window.$wujie?.bus.$off("事件名字", function (arg1, arg2, ...) {});
  }, []);
  return (
    <div className='demo-page'>
      <h1>Demo3 页面</h1>
      <p>这是子应用的第三个演示页面</p>
    </div>
  );
};

export default Demo3;
