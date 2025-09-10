import { Button, message, Tooltip } from "antd";
import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import Vditor from "vditor";
import "vditor/dist/index.css";
import useCodeContent from "@/store/useCodeContent";
// import "./index.css";
const bubbleSortMD = `
以下是JavaScript实现的冒泡排序算法：
## 基础版本
\`\`\`javascript
function bubbleSort(arr) {
    // 创建数组副本，避免修改原数组
    let result = [...arr];
    let len = result.length;
    
    // 外层循环控制排序轮数
    for (let i = 0; i < len - 1; i++) {
        // 内层循环进行相邻元素比较
        for (let j = 0; j < len - 1 - i; j++) {
            // 如果前一个元素大于后一个元素，则交换位置
            if (result[j] > result[j + 1]) {
                let temp = result[j];
                result[j] = result[j + 1];
                result[j + 1] = temp;
            }
        }
    }
    
    return result;
}
\`\`\`

## 优化版本（提前结束）

\`\`\`javascript
function bubbleSortOptimized(arr) {
    let result = [...arr];
    let len = result.length;
    
    for (let i = 0; i < len - 1; i++) {
        let swapped = false; // 标记是否发生交换
        
        for (let j = 0; j < len - 1 - i; j++) {
            if (result[j] > result[j + 1]) {
                [result[j], result[j + 1]] = [result[j + 1], result[j]]; // ES6解构交换
                swapped = true;
            }
        }
        
        // 如果这一轮没有发生交换，说明数组已经有序
        if (!swapped) {
            break;
        }
    }
    
    return result;
}
\`\`\`

## 使用示例

\`\`\`javascript
// 测试数据
let numbers = [64, 34, 25, 12, 22, 11, 90];
console.log("原数组:", numbers);

// 使用基础版本
let sorted1 = bubbleSort(numbers);
console.log("排序后:", sorted1);

// 使用优化版本
let sorted2 = bubbleSortOptimized(numbers);
console.log("优化排序后:", sorted2);

// 测试已经排序的数组
let sortedNumbers = [1, 2, 3, 4, 5];
console.log("已排序数组:", bubbleSortOptimized(sortedNumbers));
\`\`\`

## 算法说明

**工作原理：**
1. 比较相邻的两个元素
2. 如果前一个比后一个大，就交换它们的位置
3. 对每一对相邻元素做同样的工作，从开始第一对到结尾的最后一对
4. 重复以上步骤，直到没有任何一对数字需要比较

**时间复杂度：**
- 最坏情况：O(n²)
- 最好情况：O(n) - 优化版本，数组已经有序
- 平均情况：O(n²)

**空间复杂度：** O(1)

**特点：**
- 稳定排序算法
- 原地排序
- 实现简单，但效率较低
`;
const cleanMarkdown = bubbleSortMD;
//   .replace(/\n{3,}/g, '\n\n') // 多于2个换行 → 变成2个
//   .replace(/^\s+|\s+$/g, ''); // 去除首尾空白

function getCodeContent(element: Element) {
  let codeContent = "";
  element.childNodes.forEach((aa) => {
    codeContent += aa.textContent;
  });
  return codeContent;
}

export default function RenderMd(props: { domId: string; data: string }) {
  const { setAiCode } = useCodeContent();
  useEffect(() => {
    const container = document.getElementById(props.domId) as HTMLDivElement;
    Vditor.preview(container, props.data, {
      mode: "light",
      anchor: 1,
      markdown: {
        autoSpace: true,
      },
      after: () => {
        const copyNode = document.getElementsByClassName(
          "vditor-copy"
        ) as HTMLCollectionOf<HTMLElement>;
        [...copyNode].forEach((item) => {
          const node = item.querySelector(".vditor-copy-btn");
          if (node && item.contains(node)) {
          } else {
            const creatNode = document.createElement("div");
            const codeNode = item.nextElementSibling;

            if (codeNode) {
              creatNode.addEventListener("click", () => {
                setAiCode(getCodeContent(codeNode));
              });
            }
            creatNode.className = "vditor-copy-btn";
            creatNode.innerHTML = "发送到编辑器";
            creatNode.style.display = "inline-block";
            creatNode.style.cursor = "pointer";
            creatNode.style.position = "absolute";
            creatNode.style.right = "50px";
            creatNode.style.fontSize = "12px";
            creatNode.style.top = "6px";
            item.appendChild(creatNode);
          }
        });
      },
    });
  }, [props.data]);

  return (
    <>
      <div id={props.domId} />
    </>
  );
}
