export type EntityLocale = 'zh-hans' | 'ja';
export type EntityKind = 'character' | 'kibo';

type Localized = Record<EntityLocale, string>;

export type Entity = {
  revision: number;
  catalogStatus: 'verified' | 'pending';
  detailContent?: Partial<Localized>;
  detailTitle?: Partial<Localized>;
  detailDescription?: Partial<Localized>;
  detailSourceRefs?: string[];
  detailSections?: Partial<Record<EntityLocale, { id: string; title: string; paragraphs: string[]; steps?: string[] }[]>>;
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
    "image": "/images/entities/characters/metsa-official.webp",
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
    "revision": 3,
    "catalogStatus": "verified",
    "detailReview": {
      "zh-hans": {
        "status": "published",
        "revision": 3,
        "reviewer": "Project owner (publication authorized in conversation)",
        "reviewedAt": "2026-11-28",
        "sourceChecks": {
          "jp-metsa-profile-2026-11-23": "2026-11-23",
          "jp-game8-metsa-build-2026-11-28": "2026-11-28",
          "jp-metsa-official-art-2026-11-28": "2026-11-28"
        }
      },
      "ja": {
        "status": "published",
        "revision": 3,
        "reviewer": "Project owner (publication authorized in conversation)",
        "reviewedAt": "2026-11-28",
        "sourceChecks": {
          "jp-metsa-profile-2026-11-23": "2026-11-23",
          "jp-game8-metsa-build-2026-11-28": "2026-11-28",
          "jp-metsa-official-art-2026-11-28": "2026-11-28"
        },
        "translatedFromRevision": 3
      }
    },
    "origin": {
      "zh-hans": "ローズランサ（日本官网表记）",
      "ja": "ローズランサ"
    },
    "detailContent": {
      "ja": "メーツァ（Metsa）は、エヴァーガーデンのガーデナーとして日本公式に紹介されたキャラクターです。所属・ゆかりの地はローズランサ。花々が美しく咲く時まで、ともに歩むことを願います。\n\n正式サービス開始後のGame8攻略では、木・風属性の支援役として紹介され、種を拾って味方のHPや星極チャージを回復する使い方が示されています。以下の性能・編成・装備は11月28日に確認した日本向け第三者攻略に基づく整理です。当サイトの実機検証や公式の推奨編成ではありません。",
      "zh-hans": "メーツァ（Metsa）在日本官方人物介绍中是エヴァーガーデン的园丁，相关地区为ローズランサ，希望陪伴旅者直到鲜花盛开。这里保留日本姓名和地名，不据此建立国服官方名称对照。\n\n公测后的Game8攻略将其列为木、风属性的支援角色，核心玩法是生成并回收种子，为队伍恢复生命与星极充能。以下技能、配队与装备内容基于11月28日核对的日本向第三方攻略，不是本站实机测试或官方推荐；日文技能、アニマ和装备名称均保留原文。"
    },
    "detailTitle": {
      "ja": "メーツァの使い方・おすすめアニマと装備｜アズールプロミリア",
      "zh-hans": "メーツァ（Metsa）技能循环、配队与装备｜日服公测攻略"
    },
    "detailDescription": {
      "ja": "メーツァの種の生成と回収、木・風属性の支援、塗山小玉との編成、おすすめアニマ「新生」と代用、装備の選び方を正式サービス開始後の日本向け攻略から整理。",
      "zh-hans": "基于日本公测攻略整理メーツァ（Metsa）的治疗与充能、种子回收、木风配队、アニマ与装备选择，注明第三方推荐和适用版本。"
    },
    "detailSourceRefs": [
      "jp-game8-metsa-build-2026-11-28",
      "jp-metsa-official-art-2026-11-28"
    ],
    "detailSections": {
      "ja": [
        {
          "id": "combat-loop",
          "title": "種を作る→回収する→アタッカーに交代",
          "paragraphs": [
            "通常攻撃3段目で作る「蝶生の種」はチームのHP回復用、星響スキルの「霊木の種」は星極チャージの回復用です。作るだけで終わらず、拾って効果につなげることが基本になります。チャージ攻撃は周囲の種と敵を引き寄せ、まとめて回収するために使えます。",
            "通常攻撃4段目は「茨」による防御力低下も担当します。星極スキルはチームの回復と木・風属性ダメージの支援を兼ねるため、支援を入れた後に主力へ交代する流れが組みやすくなります。敵が離れたときや攻撃を受けそうなときは、回収や回避を優先し、毎回同じ手順を無理に続けないようにしましょう。"
          ],
          "steps": [
            "星響スキルを当てて霊木の種を作る。",
            "通常攻撃3段目で蝶生の種を作り、安全なら4段目までつなぐ。",
            "チャージ攻撃で散らばった種を回収する。",
            "星極スキルを使える場面で回復と支援を入れ、木・風属性のアタッカーに交代する。"
          ]
        },
        {
          "id": "team",
          "title": "塗山小玉と組む理由・編成の考え方",
          "paragraphs": [
            "Game8は「塗山小玉・メイプル・メーツァ」の編成を紹介しています。塗山小玉の風属性攻撃にメーツァの支援が合い、メーツァが得る風の刻印も活用できることが理由です。全キャラを持っている前提で組み始める必要はありません。",
            "代わりの主力を選ぶ場合は、木・風属性で攻撃するか、回復が足りているか、交代後も種を拾えるかを確認します。種はメーツァ以外の操作キャラでも拾えると説明されているため、主力へ交代した後も残った種を利用できます。回復役として採用できることと、すべての属性に同じ火力支援が入ることは分けて考えましょう。"
          ]
        },
        {
          "id": "anima",
          "title": "おすすめアニマは「新生」、代用は「木漏れ日の眼差し」",
          "paragraphs": [
            "Game8の第一候補は「新生」です。木または風の刻印を得た後、6秒以内に装着者がチャージ攻撃を行うことで、チームの攻撃力を上げる効果が紹介されています。星響スキルからチャージ攻撃で種を回収する流れと合わせやすい候補です。",
            "代用候補の「木漏れ日の眼差し」は、回復を受けたキャラの攻撃力を上げる効果です。所持している支援用アニマの説明を見比べ、発動条件を満たせるものから選びましょう。掲載元の数値を未確認の強化段階へ当てはめず、現在のゲーム内説明を優先してください。"
          ]
        },
        {
          "id": "equipment",
          "title": "装備は中盤「旅路の錬磨」、終盤「慈悲の光」を候補に",
          "paragraphs": [
            "掲載元は中盤の候補に「旅路の錬磨」を挙げています。星響スキルの発動で味方のダメージを支援する4点効果が紹介されており、種を作る行動と支援を両立しやすい構成です。",
            "終盤の候補は「慈悲の光」。回復効果を上げる2点効果と、回復を受けた味方の攻撃力を上げる4点効果が紹介されています。序盤から完成セットを前提にせず、回復量や発動条件を満たせる手持ちから使い、素材を大量投入する前に現行のセット効果を確認してください。これは第三者の段階別推奨で、全条件で最適と検証したものではありません。"
          ]
        },
        {
          "id": "profile-and-obtaining",
          "title": "声優と入手方法は？",
          "paragraphs": [
            "Game8は声優を伊藤静さん、入手方法をガチャの恒常枠として紹介しています。このページでは第三者掲載情報として扱います。開催中の観測ごとの排出対象・確率・保証は、ゲーム内の詳細を確認してください。恒常枠という説明だけで、どの観測でも同じ条件で入手できるとは判断できません。",
            "人物設定は11月23日に確認した日本公式紹介に基づきます。農園の効率や作物適性は、ガーデナーという設定だけでは判断できません。現在の技能・名称はプレイ中の日本版の表示と照合してください。"
          ]
        }
      ],
      "zh-hans": [
        {
          "id": "combat-loop",
          "title": "战斗循环：造种子、回收，再切主力",
          "paragraphs": [
            "普通攻击第三段生成的「蝶生の種」用于全队生命恢复，星响技能生成的「霊木の種」用于全队星极充能恢复。关键是把种子拾起来；只完成生成动作，还没有完成支援循环。蓄力攻击能吸引附近的敌人与种子，方便集中回收。",
            "普通攻击第四段还承担「茨」的减防作用。星极技能同时提供队伍治疗和木、风属性伤害支援，适合在支援生效后切换主力。遇到敌人分散或需要躲避的场面，先保障回收与生存，不必强行打完固定连段。"
          ],
          "steps": [
            "星响技能命中，生成霊木の種。",
            "普通攻击第三段生成蝶生の種，环境安全时衔接第四段。",
            "蓄力攻击集中回收散落种子。",
            "能使用星极技能时完成治疗与支援，再切换木或风属性主力。"
          ]
        },
        {
          "id": "team",
          "title": "为什么与塗山小玉配队？",
          "paragraphs": [
            "Game8给出的示例是「塗山小玉・メイプル・メーツァ」。理由是塗山小玉的风属性攻击可受益于メーツァ的属性支援，也能利用其获得的风刻印。这是日本版攻略的示例，不要求玩家集齐三人后才开始使用角色。",
            "换用其他主力时，先看其是否以木、风属性造成伤害，再看治疗是否足够、切人后是否方便继续拾取种子。来源说明其他操作角色同样能拾取种子，因此切主力后仍可利用场上的剩余种子。通用治疗价值与木风专属伤害支援需要分别判断。"
          ]
        },
        {
          "id": "anima",
          "title": "アニマ候选：新生与木漏れ日の眼差し",
          "paragraphs": [
            "Game8首先推荐「新生」：获得木或风刻印后6秒内由装备者进行蓄力攻击，可触发全队攻击力提升。这个条件与星响技能后蓄力回收种子的流程较为契合。",
            "替代候选「木漏れ日の眼差し」通过治疗提高受治疗角色的攻击力。先比较手中支援用アニマ的触发条件，优先选择能稳定触发的效果。强化阶段会影响判断，本文不将来源展示数值套用到所有等级，具体以当前游戏说明为准。"
          ]
        },
        {
          "id": "equipment",
          "title": "装备路线：中期旅路の錬磨、后期慈悲の光",
          "paragraphs": [
            "来源把「旅路の錬磨」作为中期候选，介绍其四件效果为施放星响技能后提高队伍伤害，可把生成种子与辅助输出结合起来。",
            "后期候选是「慈悲の光」：两件效果提高治疗效果，四件效果在治疗后提升受治疗队友的攻击力。前期先使用能满足治疗和技能触发需求的现有装备，准备大量投入材料前，再核对当前套装说明。这些是第三方按阶段给出的推荐，不是本站验证的全场景最优解。"
          ]
        },
        {
          "id": "profile-and-obtaining",
          "title": "声优、获取方式与版本边界",
          "paragraphs": [
            "Game8将声优列为伊藤静，并将获取方式介绍为常驻抽取范围。这里将其作为第三方资料收录。实际在哪个观测中能抽到、概率和保底如何，仍需查看对应观测的游戏内详情，不能仅由“常驻”推导所有卡池规则相同。",
            "人物设定沿用11月23日的日本官方核对记录。“园丁”设定不能直接说明农园效率或作物适性。本文服务于日本版资料查询，不推定国服正式姓名、实装条件或不同地区技能完全一致。"
          ]
        }
      ]
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
      "zh-hans": "以寒悠悠名义保存的图像（对应待核对）",
      "ja": "寒悠悠として保存された画像（対応確認中）"
    },
    "imageSource": "official",
    "summary": {
      "zh-hans": "公测常驻池公示已确认寒悠悠为四星角色；现有图片对应、日文姓名与人物设定仍待独立核对，资料卡暂不进入正式目录。",
      "ja": "中国本土の公測公示で寒悠悠の名前・星4・恒常対象を確認。既存画像との対応、日本語名、人物設定は確認中のため、この紹介カードは正式一覧に含めません。"
    },
    "sourceRefs": {
      "zh-hans": "cn-standard-character-pool-2026-11-26",
      "ja": "cn-standard-character-pool-2026-11-26"
    },
    "revision": 2,
    "catalogStatus": "pending",
    "detailReview": {
      "zh-hans": {
        "status": "draft",
        "revision": 2,
        "sourceChecks": {}
      },
      "ja": {
        "status": "draft",
        "revision": 2,
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
