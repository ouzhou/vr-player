---
nav:
  title: Doc
  path: /doc
---

## Basic Use

Demo:

```tsx
import React, { useRef, useEffect } from 'react';
import VrPlayer from '@ouzz/vr-player';
// import VrPlayer from './index';

export default () => {
  const ref = useRef();
  useEffect(() => {
    const player = new VrPlayer(ref.current);

    player.setScene({
      img: 'https://morecantech.oss-cn-shanghai.aliyuncs.com/panorama/1.jpeg',
      labels: [
        {
          x: -94.94951803579423,
          y: 22.079678639424586,
          z: 22.219423440939917,
          text: '测试123',
          // render(text, extraData) {
          //   const domDiv = document.createElement('div');
          //   domDiv.innerHTML = '我是自定义';
          //   return domDiv;
          // },
        },
      ],
    });
  }, []);
  return <div style={{ height: 400 }} ref={ref}></div>;
};
```
