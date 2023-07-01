<script setup lang="ts">
import {reactive} from "vue";
import {Step} from "@/type/interface.ts";
import IconNotoFaceWithMonocle from "~icons/noto/FaceWithMonocle";

const phase = ['短路', '负载', '开路', '对机']
const checkTheMachine = ['计算补偿值', '补偿值写入', '验证']

const steps: Step[] = reactive<Array<Step>>([])

for (let i = 0; i < phase.length; i++) {
  steps.push({
    current: 0,
    currentStatus: 'process',
    name: phase[i],
    content: []
  })
  if (i === 3) {
    checkTheMachine.forEach(item => {
      steps[i].content.push({
        name: item,
        content: '等待中'
      })
    })
  } else {
    for (let j = 1; j <= 4; j++) {
      steps[i].content.push({
        name: `A${j}`,
        content: '等待中'
      })
    }
  }
}

const data = [
  {
    label: '对机标品编号 :',
    value: '25',
  },
  {
    label: '对机标品值 :',
    value: '2.1',
  },
  {
    label: '验证标品编号 :',
    value: '26',
  },
  {
    label: '验证标品值 :',
    value: '2.0',
  }
];

const columns = [
  {
    title: '对机项',
    dataIndex: 'name',
  },
  {
    title: 'Post A-1',
    dataIndex: 'post1',
  },
  {
    title: 'Post A-2',
    dataIndex: 'post2',
  },
  {
    title: 'Post A-3',
    dataIndex: 'post3',
  },
  {
    title: 'Post A-4',
    dataIndex: 'post4',
  },
];
const dataBase = reactive([
  [
    {
      key: 'title1',
      value: '修改前测量',
      style: ''
    },
    {
      key: 'beforePost1',
      value: '0.1',
      style: ''
    },
    {
      key: 'beforePost2',
      value: '0.2',
      style: ''
    },
    {
      key: 'beforePost3',
      value: '0.4',
      style: ''
    },
    {
      key: 'beforePost4',
      value: '0.2',
      style: ''
    }
  ],
  [
    {
      key: 'title1',
      value: '补正值',
      style: ''
    },
    {
      key: 'editPost1',
      value: '0.21',
      style: ''
    },
    {
      key: 'editPost2',
      value: '0.25',
      style: ''
    },
    {
      key: 'editPost3',
      value: '0.42',
      style: ''
    },
    {
      key: 'editPost4',
      value: '0.12',
      style: ''
    }
  ],
  [
    {
      key: 'title1',
      value: '修改后测量',
      style: ''
    },
    {
      key: 'afterPost1',
      value: '0.15',
      style: ''
    },
    {
      key: 'afterPost2',
      value: '0.22',
      style: ''
    },
    {
      key: 'afterPost3',
      value: '0.44',
      style: ''
    },
    {
      key: 'afterPost4',
      value: '0.112',
      style: ''
    }
  ]
]);

function changeColor(i1: number, i2: number) {
  if (i2) {
    dataBase[i1][i2].style = 't-bg-red-500'
  }
}

function contextmenuChangeColor(i1: number, i2: number) {
  if (i2) {
    dataBase[i1][i2].style = 't-bg-green-500'
  }
}


</script>

<template>
  <div class="t-flex-auto t-py-2 t-px-10 t-flex t-flex-col t-select-none">
    <div class="t-h-[500px] t-flex-none t-grid t-grid-cols-1 t-content-evenly">
      <a-steps v-for="(item1,index1) in steps" :key="index1" :current="item1.current" :status="item1.currentStatus">
        <a-step v-for="item2 in item1.content" :description="item2.content">{{ item1.name + item2.name }}</a-step>
      </a-steps>
    </div>
    <div class="t-flex-auto t-grid t-grid-cols-2 t-border-2 t-rounded-md t-border-emerald-500">
      <div class="t-flex t-flex-col t-items-center t-justify-center t-gap-2">
        <div class="t-text-6xl t-flex">
          <icon-noto-face-with-monocle/>
          <span class="t-ml-2">等待开始</span>
        </div>
        <a-descriptions :data="data" :column="2" bordered/>
      </div>
      <div class="t-p-2 t-m-2 t-text-center">
        <table class="t-w-full t-h-full t-border-2 t-rounded-md">
          <tr class="t-bg-gray-200">
            <th v-for="item in columns" :key="item.dataIndex">{{ item.title }}</th>
          </tr>
          <tr v-for="(item1,index1) in dataBase" :key="index1">
            <td class="t-border-2" :class="item2.style" v-for="(item2,index2) in item1" :key="item2.key"
                @click.stop="changeColor(index1,index2)"
                @contextmenu.prevent.stop="contextmenuChangeColor(index1,index2)">
              {{ item2.value }}
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>