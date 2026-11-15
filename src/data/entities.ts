export type EntityLocale = 'zh-hans' | 'ja';
export type EntityKind = 'character' | 'kibo';

type Localized = Record<EntityLocale, string>;

export type Entity = {
  id: string;
  kind: EntityKind;
  order: number;
  image: string;
  imageAlt: Localized;
  imageSource: 'official' | 'third-party';
  names: Localized;
  romanized: string;
  aliases: Localized;
  summary: Localized;
  quote?: Localized;
  origin?: Localized;
  classification?: Localized;
  sourceRefs: Record<EntityLocale, string>;
  cv?: Localized;
  feature?: Localized;
};

export const entities: readonly Entity[] = [
  {
    id: 'anais',
    kind: 'character',
    order: 1,
    image: '/images/entities/characters/anais.webp',
    imageAlt: { 'zh-hans': '艾妮丝的官方角色立绘', ja: 'アニスの公式キャラクタービジュアル' },
    imageSource: 'official',
    names: { 'zh-hans': '艾妮丝', ja: 'アニス' },
    romanized: 'Anais',
    aliases: { 'zh-hans': 'Anaïs · アニス · 薄井友里', ja: 'Anaïs · 艾妮丝 · 薄井友里' },
    summary: {
      'zh-hans': '来自卡尔侬疗养院的护士，愿意照料大家，性格温和。公测全球预约突破 2500 万达成奖励角色。',
      ja: 'カルノン療養院から派遣された看護師。みんなのお世話を任せてほしいと語る、穏やかな人物。事前登録2500万人達成報酬。',
    },
    quote: {
      'zh-hans': '“我是艾妮丝，来自卡尔侬疗养院，随时为您提供护理服务。”',
      ja: '「カルノン療養院から派遣されました、看護師のアニスです。みんなのお世話はわたしに任せて」',
    },
    origin: { 'zh-hans': '弗利斯城邦', ja: 'フリス' },
    cv: { 'zh-hans': '薄井友里', ja: '薄井友里' },
    sourceRefs: { 'zh-hans': 'cn-official-character-kibo-2026-11-14', ja: 'jp-official-character-2026-11-14' },
  },
  {
    id: 'cathbelle',
    kind: 'character',
    order: 2,
    image: '/images/entities/characters/cathbelle.webp',
    imageAlt: { 'zh-hans': '姬瑟贝露的官方角色立绘', ja: 'キャスベルの公式キャラクタービジュアル' },
    imageSource: 'official',
    names: { 'zh-hans': '姬瑟贝露', ja: 'キャスベル' },
    romanized: 'Cathbelle',
    aliases: { 'zh-hans': 'Cathbelle · キャスベル · 小清水亚美 · 小清水亜美', ja: 'Cathbelle · 姬瑟贝露 · 小清水亜美' },
    summary: {
      'zh-hans': '奉领主之命前来侍奉，重视契约的角色。',
      ja: '領主の命により仕えるため訪れた、契約を大切にする人物。',
    },
    quote: {
      'zh-hans': '“姬瑟贝露向您问安，这是我的派遣通知，还请收好。”',
      ja: '「ごきげんよう。キャスベルと申します。領主さまの命により、こちらへお仕えに参りました」',
    },
    origin: { 'zh-hans': '弗利斯城邦', ja: 'フリス' },
    cv: { 'zh-hans': '小清水亚美', ja: '小清水亜美' },
    sourceRefs: { 'zh-hans': 'cn-official-character-kibo-2026-11-14', ja: 'jp-official-character-2026-11-14' },
  },
  {
    id: 'symphoria',
    kind: 'character',
    order: 3,
    image: '/images/entities/characters/symphoria.webp',
    imageAlt: { 'zh-hans': '西夫未瑟的官方角色立绘', ja: 'シンフォーリアの公式キャラクタービジュアル' },
    imageSource: 'official',
    names: { 'zh-hans': '西夫未瑟', ja: 'シンフォーリア' },
    romanized: 'Symphoria',
    aliases: { 'zh-hans': 'Symphoria · シンフォーリア · 西芙莉雅 · 丸冈和佳奈 · 丸岡和佳奈', ja: 'Symphoria · 西夫未瑟 · 丸岡和佳奈' },
    summary: {
      'zh-hans': '训练有素的弓手，官方介绍称其有用任何弓箭精准命中的本领。',
      ja: '十分な訓練を受けたアーチャー。どんな弓矢でも外さない腕前を持つ。',
    },
    quote: {
      'zh-hans': '“身为训练有素的射手，使用任何弓箭都要做到能精准命中，我会证明给你看的。”',
      ja: '「十分な訓練を受けたアーチャーは、どんな弓矢であろうとも外しません。いまからそれを証明して見せますね」',
    },
    origin: { 'zh-hans': '洛斯兰瑟', ja: 'ローズランサ' },
    cv: { 'zh-hans': '丸冈和佳奈', ja: '丸岡和佳奈' },
    sourceRefs: { 'zh-hans': 'cn-official-character-kibo-2026-11-14', ja: 'jp-official-character-2026-11-14' },
  },
  {
    id: 'terara',
    kind: 'character',
    order: 4,
    image: '/images/entities/characters/terara.webp',
    imageAlt: { 'zh-hans': '忒拉拉的官方角色立绘', ja: 'テララの公式キャラクタービジュアル' },
    imageSource: 'official',
    names: { 'zh-hans': '忒拉拉', ja: 'テララ' },
    romanized: 'Terara',
    aliases: { 'zh-hans': 'Terara · テララ · 菲鲁兹·蓝 · ファイルーズあい', ja: 'Terara · 忒拉拉 · ファイルーズあい' },
    summary: {
      'zh-hans': '在夏露露村长大，是村里最厉害的猎人，会保护自己的伙伴。',
      ja: 'シャルル村生まれの村一番のハンター。仲間を守る頼もしい存在。',
    },
    quote: {
      'zh-hans': '“我叫做忒拉拉，在夏露露村长大，是村子里最厉害的猎人！”',
      ja: '「アタシはテララ！シャルル村の生まれで、村一番のハンターだ！」',
    },
    origin: { 'zh-hans': '夏露露村', ja: 'シャルル村' },
    cv: { 'zh-hans': '菲鲁兹·蓝', ja: 'ファイルーズあい' },
    sourceRefs: { 'zh-hans': 'cn-official-character-kibo-2026-11-14', ja: 'jp-official-character-2026-11-14' },
  },
  {
    id: 'metsa',
    kind: 'character',
    order: 5,
    image: '/images/entities/characters/metsa.webp',
    imageAlt: { 'zh-hans': '梅茨娅的官方角色形象', ja: 'メーツァの公式キャラクタービジュアル' },
    imageSource: 'official',
    names: { 'zh-hans': '梅茨娅', ja: 'メーツァ' },
    romanized: 'Metsa',
    aliases: { 'zh-hans': 'Metsa · メーツァ · 伊藤静 · 莫萨 · 梅茨亚', ja: 'Metsa · 梅茨娅 · 伊藤静' },
    summary: {
      'zh-hans': '气质优雅神秘的魔法施法者，官方日本页面公布角色，拥有沉着深邃的洞察力。',
      ja: '優雅で神秘的な雰囲気を纏う魔法の使い手。日本公式サイト掲載キャラクター。深い洞察力を持つ。',
    },
    quote: {
      'zh-hans': '“无需焦躁，命运之星早已描摹出它的轨迹。”',
      ja: '「焦る必要はありません。運命の星は、すでに軌道を描いていますから」',
    },
    origin: { 'zh-hans': '弗利斯城邦', ja: 'フリス' },
    cv: { 'zh-hans': '伊藤静', ja: '伊藤静' },
    sourceRefs: { 'zh-hans': 'cn-official-home-2026-11-14', ja: 'jp-official-character-2026-11-14' },
  },
  {
    id: 'hanyouyou',
    kind: 'character',
    order: 6,
    image: '/images/entities/characters/hanyouyou.webp',
    imageAlt: { 'zh-hans': '寒悠悠的官方角色形象', ja: 'カンユウユウの公式キャラクタービジュアル' },
    imageSource: 'official',
    names: { 'zh-hans': '寒悠悠', ja: '寒悠悠' },
    romanized: 'Han Youyou',
    aliases: { 'zh-hans': 'Han Youyou · 寒悠悠 · 鬼头明里 · 鬼頭明里 · 寒露', ja: 'Han Youyou · カンユウユウ · 鬼頭明里' },
    summary: {
      'zh-hans': '来自东方九洲的灵巧少女，身着旗袍，精通古老符术与奇宝行商，行事敏捷利落。',
      ja: '東方の九洲から訪れた身軽な少女。チャイナドレスを纏い、奇術と星宝の商いに長ける。',
    },
    quote: {
      'zh-hans': '“不管是珍奇星宝还是情报消息，只要价钱公道，悠悠包你满意！”',
      ja: '「珍しいお宝も情報も、対価さえ払えば悠悠にお任せあれ！」',
    },
    origin: { 'zh-hans': '九洲灵域', ja: '九洲' },
    cv: { 'zh-hans': '鬼头明里', ja: '鬼頭明里' },
    sourceRefs: { 'zh-hans': 'cn-official-home-2026-11-14', ja: 'jp-official-character-2026-11-14' },
  },
  {
    id: 'staray',
    kind: 'kibo',
    order: 1,
    image: '/images/entities/kibo/staray.webp',
    imageAlt: { 'zh-hans': '星鳐的官方奇波形象', ja: 'メテオールの公式キボビジュアル' },
    imageSource: 'official',
    names: { 'zh-hans': '星鳐', ja: 'メテオール' },
    romanized: 'STARAY',
    aliases: { 'zh-hans': 'STARAY · メテオール', ja: 'STARAY · 星鳐' },
    summary: {
      'zh-hans': '拥有展开后强韧的翅膀，能够长时间滑翔，也能释放毒素攻击敌人；兴奋时可能会无意识散毒。',
      ja: '大きく広げた強靭な翼で長時間滑空でき、自在に毒をまき散らして攻撃する。興奮すると無意識に毒をまくことがある。',
    },
    classification: { 'zh-hans': '异生类 · 鳞形族', ja: '異生類 · 鱗形族' },
    feature: { 'zh-hans': '强韧翼翅 · 高空滑翔坐骑 · 毒素攻击', ja: '強靭な翼 · 飛行滑空マウント · 毒素散布' },
    sourceRefs: { 'zh-hans': 'cn-official-character-kibo-2026-11-14', ja: 'jp-official-kibo-2026-11-14' },
  },
  {
    id: 'downybrinny',
    kind: 'kibo',
    order: 2,
    image: '/images/entities/kibo/downybrinny.webp',
    imageAlt: { 'zh-hans': '绒心布里尼的官方奇波形象', ja: 'モフリーネの公式キボビジュアル' },
    imageSource: 'official',
    names: { 'zh-hans': '绒心布里尼', ja: 'モフリーネ' },
    romanized: 'DOWNYBRINNY',
    aliases: { 'zh-hans': 'DOWNYBRINNY · モフリーネ', ja: 'DOWNYBRINNY · 绒心布里尼' },
    summary: {
      'zh-hans': '数量据说只有个位数，是极为稀有的奇波；拥有八只可以独立活动的耳朵。',
      ja: '個体数が手で数えられるくらいの大変めずらしいキボ。8つの耳を独立して動かす。',
    },
    classification: { 'zh-hans': '异生类 · 兽形族', ja: '異生類 · 獣形族' },
    feature: { 'zh-hans': '超稀有异生种 · 八耳独立感知', ja: '個体数わずか · 8つの耳の独立知覚' },
    sourceRefs: { 'zh-hans': 'cn-official-character-kibo-2026-11-14', ja: 'jp-official-kibo-2026-11-14' },
  },
  {
    id: 'cabbird',
    kind: 'kibo',
    order: 3,
    image: '/images/entities/kibo/cabbird.webp',
    imageAlt: { 'zh-hans': '菜鸡的官方奇波形象', ja: 'キャバードの公式キボビジュアル' },
    imageSource: 'official',
    names: { 'zh-hans': '菜鸡', ja: 'キャバード' },
    romanized: 'CABBIRD',
    aliases: { 'zh-hans': 'CABBIRD · キャバード', ja: 'CABBIRD · 菜鸡' },
    summary: {
      'zh-hans': '常被智慧种族饲养，性格温和友好；不喜欢被揪菜叶子，被摸头时会开心地展开尾羽。',
      ja: '知的種族に人気があり、よく飼育されている。警戒心が薄く温和で、撫でられると尾羽を広げて喜ぶ。',
    },
    classification: { 'zh-hans': '异生类 · 羽形族', ja: '異生類 · 翼形族' },
    feature: { 'zh-hans': '温和伴行 · 农牧生态与开羽互动', ja: '温和なお供 · 農場飼育・尾羽コミュニケーション' },
    sourceRefs: { 'zh-hans': 'cn-official-character-kibo-2026-11-14', ja: 'jp-official-kibo-2026-11-14' },
  },
  {
    id: 'bluda',
    kind: 'kibo',
    order: 4,
    image: '/images/entities/kibo/bluda.webp',
    imageAlt: { 'zh-hans': '布鲁达的官方奇波形象', ja: 'ブルーダの公式キボビジュアル' },
    imageSource: 'official',
    names: { 'zh-hans': '布鲁达', ja: 'ブルーダ' },
    romanized: 'BLUDA',
    aliases: { 'zh-hans': 'BLUDA · ブルーダ', ja: 'BLUDA · 布鲁达' },
    summary: {
      'zh-hans': '外表独特，平衡能力不佳，游过水面时甚至会因为手脚不协调而翻倒沉下去。',
      ja: 'ユニークな見た目で、バランス感覚が悪い。水上を移動中にひっくり返り、逆さまに沈むことがある。',
    },
    classification: { 'zh-hans': '异生类 · 羽形族', ja: '異生類 · 翼形族' },
    feature: { 'zh-hans': '水生奇波 · 独特水面翻转游行', ja: '水生キボ · 個性的な水上移動' },
    sourceRefs: { 'zh-hans': 'cn-official-character-kibo-2026-11-14', ja: 'jp-official-kibo-2026-11-14' },
  },
  {
    id: 'vespervamp',
    kind: 'kibo',
    order: 5,
    image: '/images/entities/kibo/vespervamp.webp',
    imageAlt: { 'zh-hans': '怯影之翼的官方奇波形象', ja: 'ナイトフォールの公式キボビジュアル' },
    imageSource: 'official',
    names: { 'zh-hans': '怯影之翼', ja: 'ナイトフォール' },
    romanized: 'VESPERVAMP',
    aliases: { 'zh-hans': 'VESPERVAMP · ナイトフォール', ja: 'VESPERVAMP · 怯影之翼' },
    summary: {
      'zh-hans': '性格内向，容易害羞紧张；闻到感兴趣的食物后，会露出狂暴、好战的一面。',
      ja: '内向的ですぐに怯える恥ずかしがり屋。しかし好奇心を刺激する食べものの匂いで、凶暴で好戦的な一面を見せる。',
    },
    classification: { 'zh-hans': '幻生类 · 精怪族', ja: '幻生類 · 精鬼族' },
    feature: { 'zh-hans': '好战反差 · 食物气味触发狂暴战斗', ja: 'ギャップ戦闘 · 好物の匂いで凶暴・好戦化' },
    sourceRefs: { 'zh-hans': 'cn-official-character-kibo-2026-11-14', ja: 'jp-official-kibo-2026-11-14' },
  },
];

export function entitiesFor(kind: EntityKind) {
  return entities.filter((entity) => entity.kind === kind).sort((a, b) => a.order - b.order);
}
