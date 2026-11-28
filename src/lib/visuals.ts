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

// Only images rendered on these pages belong in their metadata and sitemap.
export function pageVisuals(path: string): VisualId[] {
  if (/^\/(zh-hans|ja|en)\/$/.test(path)) return ['home-world', 'holiday-illustration'];
  if (/^\/(zh-hans|ja|en)\/characters\/$/.test(path)) return ['character-ensemble', 'nono-profile', 'celebration-art'];
  if (/^\/(zh-hans|ja|en)\/kibo\/$/.test(path)) return ['kibo-companions', ...(path.startsWith('/en/') ? [] : ['kibo-showcase' as const])];
  if (/^\/(zh-hans|ja|en)\/guides\/getting-started\/$/.test(path)) return ['home-world'];
  if (/^\/(zh-hans|ja|en)\/guides\/launch\/$/.test(path)) return ['public-beta'];
  if (/^\/(zh-hans|ja|en)\/systems\/kibo\/$/.test(path)) return ['kibo-companions'];
  return [];
}

export function imageObject(id: VisualId, locale: Locale) {
  const v = visuals[id];
  return { '@type': 'ImageObject', '@id': origin + v.src + '#image', url: origin + v.src, contentUrl: origin + v.src, width: v.width, height: v.height, caption: v.caption[locale], name: v.alt[locale] };
}
