import type { ReferenceLocale as Locale } from '../lib/content';

export const contentRoutes = [
  { id: 'prepare', title: { 'zh-hans': '版本、下载与设备', ja: 'バージョン・ダウンロード・端末' }, note: { 'zh-hans': '选择游戏版本，找到PC与手机下载和故障处理。', ja: '遊ぶバージョンを選び、ダウンロードや不具合の対処へ。' }, topics: ['global-release', 'launch', 'download', 'requirements', 'platforms', 'cloud-gaming', 'support'] },
  { id: 'start', title: { 'zh-hans': '创角、领取与首次抽卡', ja: 'アカウント・報酬・初回ガチャ' }, note: { 'zh-hans': '用对账号，分开预约福利、活动与测试返还。', ja: '同じアカウントで、事前登録・イベント・返還を区別。' }, topics: ['getting-started', 'resources', 'recharge-return', 'redeem-codes', 'reroll', 'banner-rules'] },
  { id: 'play', title: { 'zh-hans': '战斗、家园与奇波', ja: '戦闘・農園・キボ' }, note: { 'zh-hans': '查捕获、种植与派遣，解决技能和生产卡点。', ja: 'キボの入手や農園の生産、スキルの困りごとを調べる。' }, topics: ['combat', 'home', 'kibo-guide'] },
] as const;

export const topicLabels: Record<string, Record<Locale, string>> = {
  'global-release': { 'zh-hans': '选发行地区', ja: '配信地域' }, launch: { 'zh-hans': '查公测时间', ja: '開始日時' }, download: { 'zh-hans': '官方下载', ja: '公式ダウンロード' }, requirements: { 'zh-hans': '容量与配置', ja: '容量・動作環境' }, platforms: { 'zh-hans': '平台与互通', ja: '対応端末・データ共有' },
  'getting-started': { 'zh-hans': '新手入门', ja: '序盤の進め方' }, resources: { 'zh-hans': '福利与领取', ja: '報酬の受取' }, 'recharge-return': { 'zh-hans': '测试充值返还', ja: '中国本土の課金返還' }, 'redeem-codes': { 'zh-hans': '兑换码与输入方法', ja: 'コード入力' }, reroll: { 'zh-hans': '首抽与账号选择', ja: 'リセマラの判断' }, 'banner-rules': { 'zh-hans': '卡池与保底', ja: 'ガチャと天井' },
  combat: { 'zh-hans': '战斗与卡关排查', ja: '戦闘の困りごと' }, home: { 'zh-hans': '家园与生产', ja: '農園と生産' }, 'kibo-guide': { 'zh-hans': '奇波获取与用途', ja: 'キボの入手と用途' },
  'cloud-gaming': { 'zh-hans': '云游戏与Mac', ja: '中国本土のクラウド・Mac' },
  support: { 'zh-hans': '登录问题与官方客服', ja: 'ログイン・公式窓口' },
};
