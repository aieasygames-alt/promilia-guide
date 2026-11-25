import type { ReferenceLocale as Locale } from '../lib/content';

export const contentRoutes = [
  { id: 'prepare', title: { 'zh-hans': '下载与开服准备', ja: 'ダウンロード・開始準備' }, note: { 'zh-hans': '先选地区，再核对设备与当前分发阶段。', ja: '地域を選び、端末と配布段階を確認。' }, topics: ['global-release', 'launch', 'download', 'requirements', 'platforms', 'support'] },
  { id: 'start', title: { 'zh-hans': '创角、领取与首次抽卡', ja: 'アカウント・報酬・初回ガチャ' }, note: { 'zh-hans': '用对账号，分开预约福利、活动与测试返还。', ja: '同じアカウントで、事前登録・イベント・返還を区別。' }, topics: ['getting-started', 'resources', 'recharge-return', 'redeem-codes', 'reroll', 'banner-rules'] },
  { id: 'play', title: { 'zh-hans': '战斗、家园与奇波', ja: '戦闘・農園・キボ' }, note: { 'zh-hans': '先查已知玩法与适用条件，再处理眼前的卡点。', ja: '確認済みの遊び方と条件を読み、目の前の問題へ。' }, topics: ['combat', 'home', 'kibo-guide'] },
] as const;

export const topicLabels: Record<string, Record<Locale, string>> = {
  'global-release': { 'zh-hans': '选发行地区', ja: '配信地域' }, launch: { 'zh-hans': '查公测时间', ja: '開始日時' }, download: { 'zh-hans': '官方下载', ja: '公式ダウンロード' }, requirements: { 'zh-hans': '容量与配置', ja: '容量・動作環境' }, platforms: { 'zh-hans': '平台与互通', ja: '対応端末・データ共有' },
  'getting-started': { 'zh-hans': '新手行动清单', ja: '初心者の準備' }, resources: { 'zh-hans': '福利与领取', ja: '報酬の受取' }, 'recharge-return': { 'zh-hans': '测试充值返还', ja: '中国本土の課金返還' }, 'redeem-codes': { 'zh-hans': '兑换码核验', ja: 'コード確認' }, reroll: { 'zh-hans': '首抽与账号选择', ja: 'リセマラの判断' }, 'banner-rules': { 'zh-hans': '卡池与保底', ja: 'ガチャ規約' },
  combat: { 'zh-hans': '战斗与卡关排查', ja: '戦闘の確認' }, home: { 'zh-hans': '家园与生产', ja: '農園と生産' }, 'kibo-guide': { 'zh-hans': '奇波获取与用途', ja: 'キボの入手と用途' },
  support: { 'zh-hans': '登录问题与官方客服', ja: 'ログイン・公式窓口' },
};
