import type { Locale } from './content';
import { origin } from './publication.mjs';

interface Visual {
  src: string; width: number; height: number;
  variants: { src: string; width: number }[];
  alt: Record<Locale, string>; caption: Record<Locale, string>;
}
const asset = (name: string, width: number, height: number, smaller: number[] = []) => ({
  src: `/images/feature/${name}.webp`, width, height,
  variants: [...smaller.map(w => ({ src: `/images/feature/${name}-${w}w.webp`, width: w })), { src: `/images/feature/${name}.webp`, width }],
});
// Artwork describes a scene; it does not verify gameplay rules or regional availability.
export const visuals = {
  'character-meadow': {
    ...asset('azur-promilia-horned-character-meadow', 1280, 720, [400, 800]),
    alt: { 'zh-hans': '蓝色星原草地场景中的棕发双角角色，身后是花田与山林。', ja: '花畑と山林を背景に、茶色の髪と角を持つキャラクターを描いたアズールプロミリアのビジュアル。', en: 'Azur Promilia horned, brown-haired character in a meadow with flowers and forested hills.' },
    caption: { 'zh-hans': '草地与角色 · 日文标识 · 用户提供素材', ja: '草原のキャラクター · 日本語ロゴ · ユーザー提供素材', en: 'Character in a meadow · Japanese logo · User-supplied artwork' },
  },
  'xiaoyu-profile': {
    ...asset('azur-promilia-tushan-xiaoyu-profile', 640, 360, [400]),
    alt: { 'zh-hans': '涂山小玉的粉发狐耳角色介绍图，画面标有「塗山小玉 / Tushan Xiaoyu」。', ja: '「塗山小玉 / Tushan Xiaoyu」と記された、ピンク髪でキツネ耳のキャラクター紹介画像。', en: 'Pink-haired, fox-eared character profile labeled 塗山小玉 / Tushan Xiaoyu.' },
    caption: { 'zh-hans': '塗山小玉 / Tushan Xiaoyu · 保留图中姓名与日文标识 · 用户提供素材', ja: '塗山小玉 / Tushan Xiaoyu · 画像内の名前と日本語ロゴを保持 · ユーザー提供素材', en: '塗山小玉 / Tushan Xiaoyu · Original name and Japanese logo retained · User-supplied artwork' },
  },
  'character-riverside': {
    ...asset('azur-promilia-blue-haired-character-riverside', 1280, 720, [400, 800]),
    alt: { 'zh-hans': '蓝白发双角角色站在水边，远处可见建筑，画面带有蓝色星原日文标识。', ja: '水辺に立つ青白い髪と角を持つキャラクター。奥には建物が見え、日本語ロゴが添えられている。', en: 'Blue-white-haired horned character beside water, with distant buildings and the Japanese Azur Promilia logo.' },
    caption: { 'zh-hans': '水边角色宣传图 · 用户提供素材 · © Manjuu Co., Ltd. © Yostar, Inc.', ja: '水辺のキャラクタービジュアル · ユーザー提供素材 · © Manjuu Co., Ltd. © Yostar, Inc.', en: 'Riverside character visual · User-supplied artwork · © Manjuu Co., Ltd. © Yostar, Inc.' },
  },
  'kibo-night': {
    ...asset('azur-promilia-kibo-night-gathering', 640, 360, [400]),
    alt: { 'zh-hans': '夜色中角色与多只奇波围坐在木栏旁，发光的小伙伴漂浮在空中。', ja: '夜の木柵に集まるキャラクターとキボ。光る仲間たちが空に浮かんでいる。', en: 'Azur Promilia characters and Kibo gathered on a wooden fence at night with glowing companions overhead.' },
    caption: { 'zh-hans': '角色与奇波的夜间插画 · 用户提供素材 · © Manjuu Co., Ltd. © Yostar, Inc.', ja: 'キャラクターとキボの夜のイラスト · ユーザー提供素材 · © Manjuu Co., Ltd. © Yostar, Inc.', en: 'Characters and Kibo at night · User-supplied artwork · © Manjuu Co., Ltd. © Yostar, Inc.' },
  },
  'elf-and-fairy': {
    ...asset('azur-promilia-elf-and-fairy', 1600, 838, [400, 800]),
    alt: { 'zh-hans': '蓝色星原金发尖耳角色的近景，右侧漂浮着带翅膀的小精灵。', ja: '金髪で尖った耳を持つキャラクターのアップと、その横に浮かぶ羽のある小さな妖精。', en: 'Azur Promilia close-up of a blonde, pointed-eared character beside a small winged fairy.' },
    caption: { 'zh-hans': '尖耳角色与小精灵 · 用户提供素材', ja: '尖った耳のキャラクターと小さな妖精 · ユーザー提供素材', en: 'Pointed-eared character and fairy · User-supplied artwork' },
  },
  'elf-portrait': {
    ...asset('azur-promilia-elf-portrait', 415, 739),
    alt: { 'zh-hans': '金发尖耳角色身穿白色与深色服装，肩旁停着一个小精灵。', ja: '白と濃色の衣装を着た金髪のキャラクター。尖った耳のそばに小さな妖精がいる。', en: 'Blonde, pointed-eared character in a white and dark outfit with a tiny fairy near her shoulder.' },
    caption: { 'zh-hans': '角色竖幅形象 · 用户提供素材', ja: 'キャラクターの縦長ビジュアル · ユーザー提供素材', en: 'Character portrait · User-supplied artwork' },
  },
  'fox-festival': {
    ...asset('azur-promilia-fox-eared-character-fireworks', 466, 658),
    alt: { 'zh-hans': '粉发狐耳角色与白色小狐狸站在桥上，身后是烟花与灯光。', ja: '花火と明かりを背景に、橋の上で白い子ギツネと過ごすピンク髪のキツネ耳キャラクター。', en: 'Pink-haired, fox-eared character on a bridge beside a small white fox, with fireworks behind them.' },
    caption: { 'zh-hans': '烟花与桥上的伙伴 · 用户提供素材', ja: '花火と橋の上の仲間 · ユーザー提供素材', en: 'Fireworks and companions on a bridge · User-supplied artwork' },
  },
  'moren-preview': {
    ...asset('azur-promilia-moren-japanese-preview', 405, 720),
    alt: { 'zh-hans': '标有日文「モーレン」的紫发尖耳角色竖屏介绍画面。', ja: '「モーレン」と名前が表示された、紫髪で尖った耳のキャラクターの縦型紹介映像の一場面。', en: 'Japanese vertical character preview labeled モーレン, showing a purple-haired, pointed-eared character.' },
    caption: { 'zh-hans': 'モーレン · 日文开发中介绍画面，保留原图文字与署名 · 用户提供素材 · © Manjuu © Yostar', ja: 'モーレン · 開発中の紹介映像の一場面。原画像の文字と権利表記を保持 · ユーザー提供素材 · © Manjuu © Yostar', en: 'モーレン · Japanese development preview with original text and credit retained · User-supplied artwork · © Manjuu © Yostar' },
  },
  'fairy-illustration': {
    ...asset('azur-promilia-winged-fairy-illustration', 1600, 900, [400, 800]),
    alt: { 'zh-hans': '金绿渐变发色、带透明翅膀的小精灵举起拳头，旁边是蓝色星原日文标识。', ja: '金色から緑に変わる髪と透き通る羽の小さな妖精が、拳を上げている日本語ロゴ入りイラスト。', en: 'Chibi fairy with blonde-to-green hair and translucent wings raising a fist beside the Japanese game logo.' },
    caption: { 'zh-hans': '小精灵主题插画 · 用户提供素材 · © Manjuu © Yostar', ja: '小さな妖精のイラスト · ユーザー提供素材 · © Manjuu © Yostar', en: 'Fairy illustration · User-supplied artwork · © Manjuu © Yostar' },
  },
  'japan-challenge': {
    ...asset('azur-promilia-japanese-kibo-challenge-visual', 1200, 675, [400, 800]),
    alt: { 'zh-hans': '蓝色星原角色与白色伙伴的日文宣传图，标题写有「目指せ！キボと皆のアズプロチャレンジ」。', ja: '「目指せ！キボと皆のアズプロチャレンジ」と題した、キャラクターと白い仲間たちの告知ビジュアル。', en: 'Japanese Azur Promilia challenge promotional visual with characters and white companions.' },
    caption: { 'zh-hans': '日文「アズプロチャレンジ」宣传图 · 用户提供素材 · © Manjuu © Yostar。各地区活动日期、参与条件和奖励请以对应官方公告为准。', ja: '「アズプロチャレンジ」告知ビジュアル · ユーザー提供素材 · © Manjuu © Yostar。開催期間・参加条件・報酬は、対象地域の公式告知をご確認ください。', en: 'Japanese アズプロチャレンジ promotional visual · User-supplied artwork · © Manjuu © Yostar. Check the relevant regional announcement for event dates, eligibility and rewards.' },
  },
  'metsa-profile': {
    src: '/images/entities/characters/metsa-official.webp', width: 1200, height: 1200,
    variants: [400, 800, 1200].map(width => ({ src: `/images/entities/characters/metsa-official${width === 1200 ? '' : `-${width}w`}.webp`, width })),
    alt: { 'zh-hans': 'メーツァ（Metsa）的日本官方角色形象', ja: 'メーツァの公式キャラクタービジュアル', en: 'Official Japanese character artwork of Metsa.' },
    caption: { 'zh-hans': 'メーツァ（Metsa）· 日本官网角色素材', ja: 'メーツァ · 日本公式サイトのキャラクター画像', en: 'Metsa · Character artwork from the official Japan website' },
  },
  'home-world': {
    ...asset('home-world', 1500, 843, [800]),
    alt: { 'zh-hans': '蓝色星原风景插画，展示山地、花田与角色。', ja: '山々、花畑、キャラクターを描いた「アズールプロミリア」の風景イラスト。', en: 'Azur Promilia landscape artwork with mountains, flowers and characters.' },
    caption: { 'zh-hans': '世界风景插画 · 用户提供素材', ja: '世界を描いたイラスト · ユーザー提供素材', en: 'World illustration · User-supplied artwork' },
  },
  'public-beta': {
    ...asset('public-beta', 1920, 1080, [960]),
    alt: { 'zh-hans': '蓝色星原：旅谣 11 月 26 日正式公测宣传图，展示角色、奇波与野外场景。', ja: '「アズールプロミリア」11月26日正式サービス開始の告知ビジュアル。キャラクター、キボ、フィールドを描いている。', en: 'Azur Promilia November 26 launch visual with characters, Kibo and a field scene.' },
    caption: { 'zh-hans': '公测宣传图 · 2026-11-26 · 用户提供素材', ja: '正式サービス開始ビジュアル · 2026-11-26 · ユーザー提供素材', en: 'November 26, 2026 launch visual · User-supplied artwork' },
  },
  'kibo-showcase': {
    ...asset('kibo-showcase', 800, 449, [400]),
    alt: { 'zh-hans': '蓝色星原角色与奇波同框宣传图，画面中央写有星宠结伴。', ja: 'キャラクターとキボを描いた「アズールプロミリア」のビジュアル。中央には「星宠结伴」の文字。', en: 'Azur Promilia character and Kibo visual with Chinese companion text.' },
    caption: { 'zh-hans': '角色与奇波宣传图 · 用户提供素材', ja: 'キャラクターとキボのビジュアル · ユーザー提供素材', en: 'Character and Kibo visual · User-supplied artwork' },
  },
  'character-ensemble': {
    ...asset('azur-promilia-character-ensemble', 480, 270, [400]),
    alt: { 'zh-hans': '蓝色星原角色群像插画，带有日文游戏标识。', ja: '桜や青い光を背景にキャラクターたちを描いた、日本語ロゴ入りのイラスト。', en: 'Azur Promilia character ensemble artwork with the Japanese game logo.' },
    caption: { 'zh-hans': '角色群像 · 日文标识 · 用户提供素材；已裁去上下黑边，不代表公测完整阵容。', ja: 'キャラクター集合イラスト · 日本語ロゴ · ユーザー提供素材。上下の黒帯を除去。正式版の全キャラクターを示すものではありません。', en: 'Character ensemble with Japanese logo · User-supplied artwork; black letterbox bars removed. Not a complete launch roster.' },
  },
  'celebration-art': {
    ...asset('azur-promilia-celebration-art', 640, 488, [400]),
    alt: { 'zh-hans': '粉发兽耳角色与系红色蝴蝶结的蓝色小伙伴，旁边写有「祝！」。', ja: 'ピンク髪の獣耳キャラクターと、赤いリボンを付けた青い仲間。「祝！」の文字が添えられている。', en: 'Pink-haired character beside a blue companion wearing a red bow, with celebratory text.' },
    caption: { 'zh-hans': '角色庆祝插画 · 用户提供素材；画面不用于确认角色名称或活动奖励。', ja: 'お祝いイラスト · ユーザー提供素材。キャラクター名やイベント報酬の確認資料ではありません。', en: 'Celebration illustration · User-supplied artwork; not used to verify character names or event rewards.' },
  },
  'holiday-illustration': {
    ...asset('azur-promilia-holiday-illustration', 1280, 720, [400, 800]),
    alt: { 'zh-hans': '蓝色星原韩文标识节日插画，角色与奇波围坐在装饰树和礼物旁。', ja: '韓国語ロゴ入りのホリデーイラスト。キャラクターとキボがツリーやプレゼントを囲んでいる。', en: 'Azur Promilia holiday illustration with characters, Kibo, presents, a decorated tree and Korean logo.' },
    caption: { 'zh-hans': '节日主题插画 · 韩文标识 · 用户提供素材。© Manjuu Co., Ltd. & NEXON Korea Corp. All Rights Reserved. 活动安排和地区服务状态请查看对应公告。', ja: '韓国語ロゴ入りのホリデーイラスト · ユーザー提供素材。© Manjuu Co., Ltd. & NEXON Korea Corp. All Rights Reserved. イベント日程や各地域のサービス状況は、それぞれの公式告知をご確認ください。', en: 'Holiday illustration with Korean logo · User-supplied artwork. © Manjuu Co., Ltd. & NEXON Korea Corp. All Rights Reserved. See the relevant official announcements for event dates and regional service availability.' },
  },
  'kibo-companions': {
    ...asset('azur-promilia-kibo-companions', 739, 415, [400]),
    alt: { 'zh-hans': '戴护目镜的白发兔耳角色与蔬菜造型奇波在蓝色野外场景中同行。', ja: 'ゴーグルを着けた白髪のウサギ耳キャラクターと、野菜のようなキボを描いたフィールドのイラスト。', en: 'White-haired rabbit-eared character with goggles beside vegetable-like Kibo in a blue landscape.' },
    caption: { 'zh-hans': '角色与奇波同行插画 · 用户提供素材；不作为奇波捕捉地点或技能依据。', ja: 'キャラクターとキボのイラスト · ユーザー提供素材。捕獲場所やスキルの根拠には使用していません。', en: 'Character and Kibo companion illustration · User-supplied artwork; not evidence of capture locations or skills.' },
  },
  'nono-profile': {
    ...asset('azur-promilia-nono-japanese-profile', 640, 480, [400]),
    alt: { 'zh-hans': '日文角色介绍图，标有「ノノ / NONO」，展示白发兔耳角色和不同表情。', ja: '「ノノ / NONO」と記されたキャラクター紹介画像。白髪のウサギ耳キャラクターと表情差分。', en: 'Japanese character profile labeled ノノ / NONO, showing a white-haired rabbit-eared character and expressions.' },
    caption: { 'zh-hans': 'ノノ / NONO 日文介绍图 · 用户提供素材，保留原图署名。名称按图中文字描述，不用于确认国服名称映射或公测技能。', ja: 'ノノ / NONO の日本語紹介画像 · ユーザー提供素材。原画像の権利表記を保持。名称は画像内の表記で、中国版との対応や正式版のスキルを確認する根拠にはしていません。', en: 'Japanese profile labeled ノノ / NONO · User-supplied artwork, with original credit retained. The label describes the image; it does not verify a China name mapping or launch skills.' },
  },
} satisfies Record<string, Visual>;

export type VisualId = keyof typeof visuals;
export const visualSrcSet = (id: VisualId) => visuals[id].variants.map(v => `${v.src} ${v.width}w`).join(', ');

// Shared by visible galleries and search metadata, so only displayed artwork is listed.
export const characterArtwork = {
  scenes: ['character-ensemble', 'character-riverside', 'elf-and-fairy', 'fairy-illustration'],
  profiles: ['xiaoyu-profile', 'nono-profile', 'celebration-art'],
  portraits: ['fox-festival', 'elf-portrait', 'moren-preview'],
} as const satisfies Record<string, readonly VisualId[]>;

// Only images rendered on these pages belong in their metadata and sitemap.
export function pageVisuals(path: string): VisualId[] {
  if (/^\/(zh-hans|ja)\/characters\/metsa\/$/.test(path)) return ['metsa-profile'];
  if (/^\/(zh-hans|ja|en)\/$/.test(path)) return ['home-world', 'holiday-illustration'];
  if (/^\/(zh-hans|ja|en)\/characters\/$/.test(path)) return ['character-meadow', ...characterArtwork.scenes, ...characterArtwork.profiles, ...characterArtwork.portraits];
  if (/^\/(zh-hans|ja|en)\/kibo\/$/.test(path)) return ['kibo-companions', ...(path.startsWith('/en/') ? [] : ['kibo-showcase' as const]), 'kibo-night'];
  if (/^\/(zh-hans|ja|en)\/guides\/getting-started\/$/.test(path)) return ['home-world'];
  if (/^\/(zh-hans|ja|en)\/guides\/launch\/$/.test(path)) return ['public-beta', 'japan-challenge'];
  if (/^\/(zh-hans|ja|en)\/systems\/kibo\/$/.test(path)) return ['kibo-companions', 'kibo-night'];
  return [];
}

export function imageObject(id: VisualId, locale: Locale) {
  const v = visuals[id];
  return { '@type': 'ImageObject', '@id': origin + v.src + '#image', url: origin + v.src, contentUrl: origin + v.src, width: v.width, height: v.height, caption: v.caption[locale], name: v.alt[locale] };
}
