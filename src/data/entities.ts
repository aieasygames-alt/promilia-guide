export type EntityLocale = 'zh-hans' | 'ja';
export type EntityKind = 'character' | 'kibo';

type Localized = Record<EntityLocale, string>;

export type Entity = {
  revision: number;
  catalogStatus: 'verified' | 'pending';
  detailContent?: Partial<Localized>;
  detailReview: Partial<Record<EntityLocale, { status: 'draft' | 'published'; revision: number; translatedFromRevision?: number; reviewer?: string; reviewedAt?: string; sourceChecks: Record<string, string> }>>;
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
    "id": "anais",
    "kind": "character",
    "order": 1,
    "names": {
      "zh-hans": "艾妮丝",
      "ja": "アニス"
    },
    "romanized": "Anais",
    "aliases": {
      "zh-hans": "Anaïs · アニス",
      "ja": "Anaïs · 艾妮丝"
    },
    "summary": {
      "zh-hans": "来自卡尔侬疗养院的护士，愿意照料大家，性格温和。",
      "ja": "カルノン療養院から派遣された看護師。みんなのお世話を任せてほしいと語る、穏やかな人物。"
    },
    "quote": {
      "zh-hans": "“我是艾妮丝，来自卡尔侬疗养院，随时为您提供护理服务。”",
      "ja": "「カルノン療養院から派遣されました、看護師のアニスです。みんなのお世話はわたしに任せて」"
    },
    "origin": {
      "zh-hans": "弗利斯城邦",
      "ja": "フリス"
    },
    "sourceRefs": {
      "zh-hans": "cn-official-character-kibo-2026-11-14",
      "ja": "jp-official-character-2026-11-14"
    },
    "image": "/images/entities/characters/anais.webp",
    "imageAlt": {
      "zh-hans": "艾妮丝的官方角色立绘",
      "ja": "アニスの公式キャラクタービジュアル"
    },
    "imageSource": "official",
    "revision": 1,
    "catalogStatus": "verified",
    "detailReview": {
      "zh-hans": {
        "status": "draft",
        "revision": 1,
        "sourceChecks": {}
      },
      "ja": {
        "status": "draft",
        "revision": 1,
        "sourceChecks": {}
      }
    }
  },
  {
    "id": "cathbelle",
    "kind": "character",
    "order": 2,
    "names": {
      "zh-hans": "姬瑟贝露",
      "ja": "キャスベル"
    },
    "romanized": "Cathbelle",
    "aliases": {
      "zh-hans": "Cathbelle · キャスベル",
      "ja": "Cathbelle · 姬瑟贝露"
    },
    "summary": {
      "zh-hans": "奉领主之命前来侍奉，重视契约的角色。",
      "ja": "領主の命により仕えるため訪れた、契約を大切にする人物。"
    },
    "quote": {
      "zh-hans": "“姬瑟贝露向您问安，这是我的派遣通知，还请收好。”",
      "ja": "「ごきげんよう。キャスベルと申します。領主さまの命により、こちらへお仕えに参りました」"
    },
    "origin": {
      "zh-hans": "弗利斯城邦",
      "ja": "フリス"
    },
    "sourceRefs": {
      "zh-hans": "cn-official-character-kibo-2026-11-14",
      "ja": "jp-official-character-2026-11-14"
    },
    "image": "/images/entities/characters/cathbelle.webp",
    "imageAlt": {
      "zh-hans": "姬瑟贝露的官方角色立绘",
      "ja": "キャスベルの公式キャラクタービジュアル"
    },
    "imageSource": "official",
    "revision": 1,
    "catalogStatus": "verified",
    "detailReview": {
      "zh-hans": {
        "status": "draft",
        "revision": 1,
        "sourceChecks": {}
      },
      "ja": {
        "status": "draft",
        "revision": 1,
        "sourceChecks": {}
      }
    }
  },
  {
    "id": "symphoria",
    "kind": "character",
    "order": 3,
    "names": {
      "zh-hans": "西夫未瑟",
      "ja": "シンフォーリア"
    },
    "romanized": "Symphoria",
    "aliases": {
      "zh-hans": "Symphoria · シンフォーリア",
      "ja": "Symphoria · 西夫未瑟"
    },
    "summary": {
      "zh-hans": "训练有素的弓手，官方介绍称其有用任何弓箭精准命中的本领。",
      "ja": "十分な訓練を受けたアーチャー。どんな弓矢でも外さない腕前を持つ。"
    },
    "quote": {
      "zh-hans": "“身为训练有素的射手，使用任何弓箭都要做到能精准命中，我会证明给你看的。”",
      "ja": "「十分な訓練を受けたアーチャーは、どんな弓矢であろうとも外しません。いまからそれを証明して見せますね」"
    },
    "origin": {
      "zh-hans": "洛斯兰瑟",
      "ja": "ローズランサ"
    },
    "sourceRefs": {
      "zh-hans": "cn-official-character-kibo-2026-11-14",
      "ja": "jp-official-character-2026-11-14"
    },
    "image": "/images/entities/characters/symphoria.webp",
    "imageAlt": {
      "zh-hans": "西夫未瑟的官方角色立绘",
      "ja": "シンフォーリアの公式キャラクタービジュアル"
    },
    "imageSource": "official",
    "revision": 1,
    "catalogStatus": "verified",
    "detailReview": {
      "zh-hans": {
        "status": "draft",
        "revision": 1,
        "sourceChecks": {}
      },
      "ja": {
        "status": "draft",
        "revision": 1,
        "sourceChecks": {}
      }
    }
  },
  {
    "id": "terara",
    "kind": "character",
    "order": 4,
    "names": {
      "zh-hans": "忒拉拉",
      "ja": "テララ"
    },
    "romanized": "Terara",
    "aliases": {
      "zh-hans": "Terara · テララ",
      "ja": "Terara · 忒拉拉"
    },
    "summary": {
      "zh-hans": "在夏露露村长大，是村里最厉害的猎人，会保护自己的伙伴。",
      "ja": "シャルル村生まれの村一番のハンター。仲間を守る頼もしい存在。"
    },
    "quote": {
      "zh-hans": "“我叫做忒拉拉，在夏露露村长大，是村子里最厉害的猎人！”",
      "ja": "「アタシはテララ！シャルル村の生まれで、村一番のハンターだ！」"
    },
    "origin": {
      "zh-hans": "夏露露村",
      "ja": "シャルル村"
    },
    "sourceRefs": {
      "zh-hans": "cn-official-character-kibo-2026-11-14",
      "ja": "jp-official-character-2026-11-14"
    },
    "image": "/images/entities/characters/terara.webp",
    "imageAlt": {
      "zh-hans": "忒拉拉的官方角色立绘",
      "ja": "テララの公式キャラクタービジュアル"
    },
    "imageSource": "official",
    "revision": 1,
    "catalogStatus": "verified",
    "detailReview": {
      "zh-hans": {
        "status": "draft",
        "revision": 1,
        "sourceChecks": {}
      },
      "ja": {
        "status": "draft",
        "revision": 1,
        "sourceChecks": {}
      }
    }
  },
  {
    "id": "metsa",
    "kind": "character",
    "order": 5,
    "names": {
      "zh-hans": "メーツァ",
      "ja": "メーツァ"
    },
    "romanized": "Metsa",
    "aliases": {
      "zh-hans": "Metsa · メーツァ",
      "ja": "Metsa"
    },
    "image": "/images/entities/characters/metsa.webp",
    "imageAlt": {
      "zh-hans": "メーツァ（Metsa）的日本官方角色形象",
      "ja": "メーツァの公式キャラクタービジュアル"
    },
    "imageSource": "official",
    "summary": {
      "zh-hans": "日本官网公开人物：エヴァーガーデン的园丁，愿与旅伴同行直到鲜花盛开。中文官方姓名尚待核验，此处保留日文名称。",
      "ja": "エヴァーガーデンのガーデナー。花々が美しく咲き誇る時まで、ともに歩むことを願う。"
    },
    "sourceRefs": {
      "zh-hans": "jp-metsa-profile-2026-11-23",
      "ja": "jp-metsa-profile-2026-11-23"
    },
    "revision": 2,
    "catalogStatus": "verified",
    "detailReview": {
      "zh-hans": {
        "status": "draft",
        "revision": 2,
        "sourceChecks": {
          "jp-metsa-profile-2026-11-23": "2026-11-23"
        }
      },
      "ja": {
        "status": "draft",
        "revision": 2,
        "translatedFromRevision": 2,
        "sourceChecks": {
          "jp-metsa-profile-2026-11-23": "2026-11-23"
        }
      }
    },
    "origin": {
      "zh-hans": "ローズランサ（日本官网表记）",
      "ja": "ローズランサ"
    },
    "detailContent": {
      "ja": "メーツァ（Metsa）は、日本公式サイトのキャラクター一覧と独立した人物紹介で確認できます。紹介ではエヴァーガーデンのガーデナーとされ、所属・ゆかりの地はローズランサと記載されています。中国本土での正式な名前や実装条件は、この日本向け紹介からは判断できません。\n\n花々が咲き誇る時まで旅をともにしたい、というメッセージが人物像の手がかりです。「ガーデナー」は公開された設定であり、農園の効率、特定作物への適性、回復役といったゲーム内性能を意味するものではありません。\n\n今回の紹介原文からは、正式版の技能、数値、育成素材、声優、入手方法を確定できません。編成やリセマラの判断には対象地域・バージョンの技能説明と比較条件が必要です。まず公式紹介で人物を確認し、関連ガイドでアカウント条件やサービス開始の準備を進めてください。",
      "zh-hans": "メーツァ（Metsa）可在日本官网角色列表及独立人物页核对。官网介绍其为エヴァーガーデン的园丁，所属或相关地区为ローズランサ。当前保留日文姓名与地区原文，不将旧稿中文译名当作官方确认，也不由日本介绍推断国服实装条件。\n\n希望陪伴旅者直到鲜花盛开，是人物留言提供的性格线索。“园丁”是公开设定，不能据此认定农园效率、作物适性或治疗定位。\n\n本次人物原文不足以确认正式技能、倍率、养成材料、声优和获取方式。编队或刷初始判断需要对应地区及版本的技能说明与统一比较条件；可先阅读官方人物介绍，再从相关指南核对账号规则和开服准备。"
    }
  },
  {
    "id": "hanyouyou",
    "kind": "character",
    "order": 6,
    "names": {
      "zh-hans": "寒悠悠",
      "ja": "寒悠悠"
    },
    "romanized": "Han Youyou",
    "aliases": {
      "zh-hans": "Han Youyou",
      "ja": "Han Youyou"
    },
    "image": "/images/entities/characters/hanyouyou.webp",
    "imageAlt": {
      "zh-hans": "寒悠悠的官方角色形象",
      "ja": "カンユウユウの公式キャラクタービジュアル"
    },
    "imageSource": "official",
    "summary": {
      "zh-hans": "此条名称与人物设定仍待补充独立来源，暂不进入正式目录。",
      "ja": "名称と人物設定の独立した出典を確認中のため、正式な一覧には含めません。"
    },
    "sourceRefs": {
      "zh-hans": "cn-official-home-2026-11-14",
      "ja": "jp-official-character-2026-11-14"
    },
    "revision": 1,
    "catalogStatus": "pending",
    "detailReview": {
      "zh-hans": {
        "status": "draft",
        "revision": 1,
        "sourceChecks": {}
      },
      "ja": {
        "status": "draft",
        "revision": 1,
        "sourceChecks": {}
      }
    }
  },
  {
    "id": "staray",
    "kind": "kibo",
    "order": 1,
    "names": {
      "zh-hans": "星鳐",
      "ja": "メテオール"
    },
    "romanized": "STARAY",
    "aliases": {
      "zh-hans": "STARAY · メテオール",
      "ja": "STARAY · 星鳐"
    },
    "summary": {
      "zh-hans": "拥有展开后强韧的翅膀，能够长时间滑翔，也能释放毒素攻击敌人；兴奋时可能会无意识散毒。",
      "ja": "大きく広げた強靭な翼で長時間滑空でき、自在に毒をまき散らして攻撃する。興奮すると無意識に毒をまくことがある。"
    },
    "classification": {
      "zh-hans": "异生类 · 鳞形族",
      "ja": "異生類 · 鱗形族"
    },
    "sourceRefs": {
      "zh-hans": "cn-official-character-kibo-2026-11-14",
      "ja": "jp-official-kibo-2026-11-14"
    },
    "image": "/images/entities/kibo/staray.webp",
    "imageAlt": {
      "zh-hans": "星鳐的官方奇波形象",
      "ja": "メテオールの公式キボビジュアル"
    },
    "imageSource": "official",
    "revision": 1,
    "catalogStatus": "verified",
    "detailReview": {
      "zh-hans": {
        "status": "draft",
        "revision": 1,
        "sourceChecks": {}
      },
      "ja": {
        "status": "draft",
        "revision": 1,
        "sourceChecks": {}
      }
    }
  },
  {
    "id": "downybrinny",
    "kind": "kibo",
    "order": 2,
    "names": {
      "zh-hans": "绒心布里尼",
      "ja": "モフリーネ"
    },
    "romanized": "DOWNYBRINNY",
    "aliases": {
      "zh-hans": "DOWNYBRINNY · モフリーネ",
      "ja": "DOWNYBRINNY · 绒心布里尼"
    },
    "summary": {
      "zh-hans": "数量据说只有个位数，是极为稀有的奇波；拥有八只可以独立活动的耳朵。",
      "ja": "個体数が手で数えられるくらいの大変めずらしいキボ。8つの耳を独立して動かす。"
    },
    "classification": {
      "zh-hans": "异生类 · 兽形族",
      "ja": "異生類 · 獣形族"
    },
    "sourceRefs": {
      "zh-hans": "cn-official-character-kibo-2026-11-14",
      "ja": "jp-official-kibo-2026-11-14"
    },
    "image": "/images/entities/kibo/downybrinny.webp",
    "imageAlt": {
      "zh-hans": "绒心布里尼的官方奇波形象",
      "ja": "モフリーネの公式キボビジュアル"
    },
    "imageSource": "official",
    "revision": 1,
    "catalogStatus": "verified",
    "detailReview": {
      "zh-hans": {
        "status": "draft",
        "revision": 1,
        "sourceChecks": {}
      },
      "ja": {
        "status": "draft",
        "revision": 1,
        "sourceChecks": {}
      }
    }
  },
  {
    "id": "cabbird",
    "kind": "kibo",
    "order": 3,
    "names": {
      "zh-hans": "菜鸡",
      "ja": "キャバード"
    },
    "romanized": "CABBIRD",
    "aliases": {
      "zh-hans": "CABBIRD · キャバード",
      "ja": "CABBIRD · 菜鸡"
    },
    "summary": {
      "zh-hans": "常被智慧种族饲养，性格温和友好；不喜欢被揪菜叶子，被摸头时会开心地展开尾羽。",
      "ja": "知的種族に人気があり、よく飼育されている。警戒心が薄く温和で、撫でられると尾羽を広げて喜ぶ。"
    },
    "classification": {
      "zh-hans": "异生类 · 羽形族",
      "ja": "異生類 · 翼形族"
    },
    "sourceRefs": {
      "zh-hans": "cn-official-character-kibo-2026-11-14",
      "ja": "jp-cabbird-profile-2026-11-23"
    },
    "image": "/images/entities/kibo/cabbird.webp",
    "imageAlt": {
      "zh-hans": "菜鸡的官方奇波形象",
      "ja": "キャバードの公式キボビジュアル"
    },
    "imageSource": "official",
    "revision": 2,
    "catalogStatus": "verified",
    "detailReview": {
      "zh-hans": {
        "status": "draft",
        "revision": 2,
        "sourceChecks": {
          "cn-official-character-kibo-2026-11-14": "2026-11-14",
          "jp-cabbird-profile-2026-11-23": "2026-11-23"
        }
      },
      "ja": {
        "status": "draft",
        "revision": 2,
        "translatedFromRevision": 2,
        "sourceChecks": {
          "cn-official-character-kibo-2026-11-14": "2026-11-14",
          "jp-cabbird-profile-2026-11-23": "2026-11-23"
        }
      }
    },
    "detailContent": {
      "ja": "キャバード（CABBIRD）は、日本公式のキボ一覧と独立した生態紹介に掲載されています。分類は「異生類-翼形族」。中国本土の公式表示にある「菜鸡」と同じ英文識別子を使っていますが、日本語名と分類は日本の原文を参照します。\n\n紹介によると、知的種族に人気があり、警戒心が薄く温和なキボです。頭の葉っぱを引っ張られるのは嫌がり、撫でられると尾羽を広げて喜びます。これは公開された生態描写であり、正式クライアントに同じ操作ボタンや効果があることを確認した記録ではありません。\n\n捕獲地点、出現条件、必要な道具、家園で担当できる仕事、作業速度は今回の個別紹介では確認できません。キボ全体の協力作業が案内されていても、すべての仕事をキャバードに割り当てられるとは限りません。役割を調べるときはキボ指南とホームの解説を参照し、ゲーム内での確認条件を分けて記録してください。",
      "zh-hans": "菜鸡（CABBIRD）可在国服官网奇波展示及日本官网独立生态页核对，日本名为キャバード。日本官网分类为“異生類-翼形族”；本站中文分类继续保留国服的“异生类・羽形族”，不把两地表记改成同一个译名。\n\n官方介绍其受到智慧种族喜爱，警戒心较弱、性格温和；不喜欢被揪头上的叶片，被抚摸时会展开尾羽。这些是公开生态描述，不是正式客户端互动按钮或效果的实测记录。\n\n本次个体介绍未能确认捕捉地点、出现条件、所需工具、具体家园岗位及工作速度。奇波整体拥有协作玩法，不能证明菜鸡能承担所有工作。可结合奇波指南和家园说明，分别记录后续游戏内验证条件。"
    }
  },
  {
    "id": "bluda",
    "kind": "kibo",
    "order": 4,
    "names": {
      "zh-hans": "布鲁达",
      "ja": "ブルーダ"
    },
    "romanized": "BLUDA",
    "aliases": {
      "zh-hans": "BLUDA · ブルーダ",
      "ja": "BLUDA · 布鲁达"
    },
    "summary": {
      "zh-hans": "外表独特，平衡能力不佳，游过水面时甚至会因为手脚不协调而翻倒沉下去。",
      "ja": "ユニークな見た目で、バランス感覚が悪い。水上を移動中にひっくり返り、逆さまに沈むことがある。"
    },
    "classification": {
      "zh-hans": "异生类 · 羽形族",
      "ja": "異生類 · 翼形族"
    },
    "sourceRefs": {
      "zh-hans": "cn-official-character-kibo-2026-11-14",
      "ja": "jp-official-kibo-2026-11-14"
    },
    "image": "/images/entities/kibo/bluda.webp",
    "imageAlt": {
      "zh-hans": "布鲁达的官方奇波形象",
      "ja": "ブルーダの公式キボビジュアル"
    },
    "imageSource": "official",
    "revision": 1,
    "catalogStatus": "verified",
    "detailReview": {
      "zh-hans": {
        "status": "draft",
        "revision": 1,
        "sourceChecks": {}
      },
      "ja": {
        "status": "draft",
        "revision": 1,
        "sourceChecks": {}
      }
    }
  },
  {
    "id": "vespervamp",
    "kind": "kibo",
    "order": 5,
    "names": {
      "zh-hans": "怯影之翼",
      "ja": "ナイトフォール"
    },
    "romanized": "VESPERVAMP",
    "aliases": {
      "zh-hans": "VESPERVAMP · ナイトフォール",
      "ja": "VESPERVAMP · 怯影之翼"
    },
    "summary": {
      "zh-hans": "性格内向，容易害羞紧张；闻到感兴趣的食物后，会露出狂暴、好战的一面。",
      "ja": "内向的ですぐに怯える恥ずかしがり屋。しかし好奇心を刺激する食べものの匂いで、凶暴で好戦的な一面を見せる。"
    },
    "classification": {
      "zh-hans": "幻生类 · 精怪族",
      "ja": "幻生類 · 精鬼族"
    },
    "sourceRefs": {
      "zh-hans": "cn-official-character-kibo-2026-11-14",
      "ja": "jp-official-kibo-2026-11-14"
    },
    "image": "/images/entities/kibo/vespervamp.webp",
    "imageAlt": {
      "zh-hans": "怯影之翼的官方奇波形象",
      "ja": "ナイトフォールの公式キボビジュアル"
    },
    "imageSource": "official",
    "revision": 1,
    "catalogStatus": "verified",
    "detailReview": {
      "zh-hans": {
        "status": "draft",
        "revision": 1,
        "sourceChecks": {}
      },
      "ja": {
        "status": "draft",
        "revision": 1,
        "sourceChecks": {}
      }
    }
  }
];

export function entitiesFor(kind: EntityKind) {
  return entities.filter(entity => entity.kind === kind).sort((a, b) => a.order - b.order);
}
