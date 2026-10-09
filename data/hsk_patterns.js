// Grammar patterns (hand-authored, CC-BY-SA-4.0 like hsk_sentences.js): HSK 2-4 patterns
// drilled as cloze in vocab-engine's Sentences step (pack flag `patterns`).
// Each pattern: {id, lv, label, en, note: [line1, line2], near?: [pattern ids whose marks
// are never offered as wrong options], sentences: [{zh, py, en, words, marks}]}. words
// segments zh the way hsk_sentences.js does (VOCAB words, SENTENCE_EXTRA or PATTERN_EXTRA
// tokens at or below lv); marks are [start, end) character ranges of zh to blank (one per ask, cycled).
// Validated by tools/check_patterns.py; vocab-engine/tools/pack_from_hsk.py turns it
// into pack/patterns.json.
// PATTERN_EXTRA: compound tokens only pattern sentences use, {token: {py, base}} as
// SENTENCE_EXTRA. Kept apart so they do not become pack.compounds (which would stop
// sentence and passage blanks inside 下雪, 十二, ... with the patterns flag off).
const PATTERN_EXTRA={"一下": {"py": "yīxià", "base": "一"}, "以外": {"py": "yǐwài", "base": "以"}, "越来越": {"py": "yuèláiyuè", "base": "越"}, "走路": {"py": "zǒulù", "base": "走"}, "下雪": {"py": "xiàxuě", "base": "雪"}, "进来": {"py": "jìnlai", "base": "进"}, "坐坐": {"py": "zuòzuo", "base": "坐"}, "十二": {"py": "shí'èr", "base": "十"}};
const PATTERNS=[
 {"id": "p01", "lv": 2, "label": "比", "en": "more … than", "note": ["Compares two things: A is more … than B.", "A 比 B + adjective (no 很): 我比他高。"], "sentences": [
  {"zh": "哥哥比我高。", "py": "Gēge bǐ wǒ gāo.", "en": "My older brother is taller than me.", "words": ["哥哥", "比", "我", "高"], "marks": [[2, 3]]},
  {"zh": "今天比昨天冷。", "py": "Jīntiān bǐ zuótiān lěng.", "en": "Today is colder than yesterday.", "words": ["今天", "比", "昨天", "冷"], "marks": [[2, 3]]},
  {"zh": "跑步比游泳累。", "py": "Pǎobù bǐ yóuyǒng lèi.", "en": "Running is more tiring than swimming.", "words": ["跑步", "比", "游泳", "累"], "marks": [[2, 3]]},
  {"zh": "这个比那个便宜。", "py": "Zhège bǐ nàge piányi.", "en": "This one is cheaper than that one.", "words": ["这个", "比", "那个", "便宜"], "marks": [[2, 3]]},
  {"zh": "我的手机比你的新。", "py": "Wǒ de shǒujī bǐ nǐ de xīn.", "en": "My phone is newer than yours.", "words": ["我", "的", "手机", "比", "你", "的", "新"], "marks": [[4, 5]]},
  {"zh": "咖啡比茶贵。", "py": "Kāfēi bǐ chá guì.", "en": "Coffee costs more than tea.", "words": ["咖啡", "比", "茶", "贵"], "marks": [[2, 3]]},
  {"zh": "她比我大两岁。", "py": "Tā bǐ wǒ dà liǎng suì.", "en": "She is two years older than me.", "words": ["她", "比", "我", "大", "两", "岁"], "marks": [[1, 2]]}
 ]},
 {"id": "p02", "lv": 2, "label": "正在…呢", "en": "in the middle of (doing)", "note": ["An action going on right now.", "正在 + verb (+ 呢): 他正在睡觉呢。"], "near": ["p21"], "sentences": [
  {"zh": "我正在看书呢。", "py": "Wǒ zhèngzài kàn shū ne.", "en": "I'm reading right now.", "words": ["我", "正在", "看", "书", "呢"], "marks": [[1, 3], [5, 6]]},
  {"zh": "妈妈正在做菜呢。", "py": "Māma zhèngzài zuò cài ne.", "en": "Mom is cooking right now.", "words": ["妈妈", "正在", "做", "菜", "呢"], "marks": [[2, 4], [6, 7]]},
  {"zh": "他们正在打篮球呢。", "py": "Tāmen zhèngzài dǎlánqiú ne.", "en": "They're playing basketball right now.", "words": ["他们", "正在", "打篮球", "呢"], "marks": [[2, 4], [7, 8]]},
  {"zh": "孩子正在睡觉呢。", "py": "Háizi zhèngzài shuìjiào ne.", "en": "The child is sleeping right now.", "words": ["孩子", "正在", "睡觉", "呢"], "marks": [[2, 4], [6, 7]]},
  {"zh": "北京正在下雨呢。", "py": "Běijīng zhèngzài xiàyǔ ne.", "en": "It's raining in Beijing right now.", "words": ["北京", "正在", "下雨", "呢"], "marks": [[2, 4], [6, 7]]},
  {"zh": "你正在做什么呢？", "py": "Nǐ zhèngzài zuò shénme ne?", "en": "What are you doing right now?", "words": ["你", "正在", "做", "什么", "呢"], "marks": [[1, 3], [6, 7]]},
  {"zh": "爸爸正在看报纸呢。", "py": "Bàba zhèngzài kàn bàozhǐ ne.", "en": "Dad is reading the paper right now.", "words": ["爸爸", "正在", "看", "报纸", "呢"], "marks": [[2, 4], [7, 8]]}
 ]},
 {"id": "p03", "lv": 2, "label": "一下", "en": "(do) a bit, briefly", "note": ["Softens a verb: do it briefly or casually.", "verb + 一下: 你看一下。"], "near": ["p21"], "sentences": [
  {"zh": "请你听一下。", "py": "Qǐng nǐ tīng yīxià.", "en": "Please have a listen.", "words": ["请", "你", "听", "一下"], "marks": [[3, 5]]},
  {"zh": "我看一下你的书。", "py": "Wǒ kàn yīxià nǐ de shū.", "en": "Let me take a look at your book.", "words": ["我", "看", "一下", "你", "的", "书"], "marks": [[2, 4]]},
  {"zh": "我们休息一下吧。", "py": "Wǒmen xiūxi yīxià ba.", "en": "Let's rest for a bit.", "words": ["我们", "休息", "一下", "吧"], "marks": [[4, 6]]},
  {"zh": "你来一下，好吗？", "py": "Nǐ lái yīxià, hǎo ma?", "en": "Could you come here a moment?", "words": ["你", "来", "一下", "好", "吗"], "marks": [[2, 4]]},
  {"zh": "我问一下老师。", "py": "Wǒ wèn yīxià lǎoshī.", "en": "I'll just ask the teacher.", "words": ["我", "问", "一下", "老师"], "marks": [[2, 4]]},
  {"zh": "你介绍一下你的朋友。", "py": "Nǐ jièshào yīxià nǐ de péngyou.", "en": "Introduce your friend.", "words": ["你", "介绍", "一下", "你", "的", "朋友"], "marks": [[3, 5]]},
  {"zh": "让我想一下。", "py": "Ràng wǒ xiǎng yīxià.", "en": "Let me think for a second.", "words": ["让", "我", "想", "一下"], "marks": [[3, 5]]}
 ]},
 {"id": "p04", "lv": 2, "label": "因为…所以", "en": "because … so", "note": ["Gives a reason, then the result.", "因为 A，所以 B"], "near": ["p13", "p19", "p26"], "sentences": [
  {"zh": "因为下雨，所以我没去。", "py": "Yīnwèi xiàyǔ, suǒyǐ wǒ méi qù.", "en": "Because it rained, I didn't go.", "words": ["因为", "下雨", "所以", "我", "没", "去"], "marks": [[0, 2], [5, 7]]},
  {"zh": "因为他生病了，所以没来。", "py": "Yīnwèi tā shēngbìng le, suǒyǐ méi lái.", "en": "He was sick, so he didn't come.", "words": ["因为", "他", "生病", "了", "所以", "没", "来"], "marks": [[0, 2], [7, 9]]},
  {"zh": "因为太累了，所以我想休息。", "py": "Yīnwèi tài lèi le, suǒyǐ wǒ xiǎng xiūxi.", "en": "I'm too tired, so I want to rest.", "words": ["因为", "太", "累", "了", "所以", "我", "想", "休息"], "marks": [[0, 2], [6, 8]]},
  {"zh": "因为很便宜，所以我买了。", "py": "Yīnwèi hěn piányi, suǒyǐ wǒ mǎi le.", "en": "It was cheap, so I bought it.", "words": ["因为", "很", "便宜", "所以", "我", "买", "了"], "marks": [[0, 2], [6, 8]]},
  {"zh": "因为天气好，所以我们去玩。", "py": "Yīnwèi tiānqì hǎo, suǒyǐ wǒmen qù wán.", "en": "The weather is nice, so we're going out.", "words": ["因为", "天气", "好", "所以", "我们", "去", "玩"], "marks": [[0, 2], [6, 8]]},
  {"zh": "因为有考试，所以他很忙。", "py": "Yīnwèi yǒu kǎoshì, suǒyǐ tā hěn máng.", "en": "He has an exam, so he's busy.", "words": ["因为", "有", "考试", "所以", "他", "很", "忙"], "marks": [[0, 2], [6, 8]]},
  {"zh": "因为我不懂，所以我问了老师。", "py": "Yīnwèi wǒ bù dǒng, suǒyǐ wǒ wèn le lǎoshī.", "en": "I didn't understand, so I asked the teacher.", "words": ["因为", "我", "不", "懂", "所以", "我", "问", "了", "老师"], "marks": [[0, 2], [6, 8]]}
 ]},
 {"id": "p05", "lv": 2, "label": "是…的", "en": "it was … that (when, where, how)", "note": ["Stresses when, where or how a past action happened.", "是 + detail + verb + 的: 我是昨天来的。"], "near": ["p06", "p12", "p13", "p14", "p15", "p23"], "sentences": [
  {"zh": "我是坐飞机来的。", "py": "Wǒ shì zuò fēijī lái de.", "en": "I came by plane.", "words": ["我", "是", "坐", "飞机", "来", "的"], "marks": [[1, 2], [6, 7]]},
  {"zh": "你是怎么来的？", "py": "Nǐ shì zěnme lái de?", "en": "How did you get here?", "words": ["你", "是", "怎么", "来", "的"], "marks": [[1, 2], [5, 6]]},
  {"zh": "他是昨天来的。", "py": "Tā shì zuótiān lái de.", "en": "He came yesterday.", "words": ["他", "是", "昨天", "来", "的"], "marks": [[1, 2], [5, 6]]},
  {"zh": "我们是在北京认识的。", "py": "Wǒmen shì zài Běijīng rènshi de.", "en": "We met in Beijing.", "words": ["我们", "是", "在", "北京", "认识", "的"], "marks": [[2, 3], [8, 9]]},
  {"zh": "这本书是在哪儿买的？", "py": "Zhè běn shū shì zài nǎr mǎi de?", "en": "Where did you buy this book?", "words": ["这", "本", "书", "是", "在", "哪儿", "买", "的"], "marks": [[3, 4], [8, 9]]},
  {"zh": "她是去年来中国的。", "py": "Tā shì qùnián lái Zhōngguó de.", "en": "She came to China last year.", "words": ["她", "是", "去年", "来", "中国", "的"], "marks": [[1, 2], [7, 8]]},
  {"zh": "我是和朋友一起去的。", "py": "Wǒ shì hé péngyou yīqǐ qù de.", "en": "I went with a friend.", "words": ["我", "是", "和", "朋友", "一起", "去", "的"], "marks": [[1, 2], [8, 9]]}
 ]},
 {"id": "p06", "lv": 2, "label": "了 vs 过", "en": "did vs have ever done", "note": ["了: an action got done. 过: you have done it before.", "去了 went · 去过 have been"], "sentences": [
  {"zh": "我还没去过北京。", "py": "Wǒ hái méi qù guò Běijīng.", "en": "I haven't been to Beijing yet.", "words": ["我", "还", "没", "去", "过", "北京"], "marks": [[4, 5]]},
  {"zh": "我没看过这个电影。", "py": "Wǒ méi kàn guò zhège diànyǐng.", "en": "I've never seen this movie.", "words": ["我", "没", "看", "过", "这个", "电影"], "marks": [[3, 4]]},
  {"zh": "你没吃过中国菜吗？", "py": "Nǐ méi chī guò Zhōngguó cài ma?", "en": "Haven't you ever had Chinese food?", "words": ["你", "没", "吃", "过", "中国", "菜", "吗"], "marks": [[3, 4]]},
  {"zh": "他还没来过我家。", "py": "Tā hái méi lái guò wǒ jiā.", "en": "He hasn't been to my home yet.", "words": ["他", "还", "没", "来", "过", "我", "家"], "marks": [[4, 5]]},
  {"zh": "我们快到了。", "py": "Wǒmen kuài dào le.", "en": "We're almost there.", "words": ["我们", "快", "到", "了"], "marks": [[4, 5]]},
  {"zh": "快下雨了。", "py": "Kuài xiàyǔ le.", "en": "It's about to rain.", "words": ["快", "下雨", "了"], "marks": [[3, 4]]},
  {"zh": "我到了就给你打电话。", "py": "Wǒ dào le jiù gěi nǐ dǎdiànhuà.", "en": "I'll call you when I get there.", "words": ["我", "到", "了", "就", "给", "你", "打电话"], "marks": [[2, 3]]},
  {"zh": "这件衣服太贵了。", "py": "Zhè jiàn yīfu tài guì le.", "en": "This piece of clothing is too expensive.", "words": ["这", "件", "衣服", "太", "贵", "了"], "marks": [[6, 7]]}
 ]},
 {"id": "p07", "lv": 3, "label": "虽然…但是", "en": "although … (but)", "note": ["Admits one fact, then says the other still holds.", "虽然 A，但是 B"], "near": ["p13", "p20", "p26"], "sentences": [
  {"zh": "虽然很累，但是我很高兴。", "py": "Suīrán hěn lèi, dànshì wǒ hěn gāoxìng.", "en": "Although I'm tired, I'm happy.", "words": ["虽然", "很", "累", "但是", "我", "很", "高兴"], "marks": [[0, 2], [5, 7]]},
  {"zh": "虽然下雨了，但是他还是来了。", "py": "Suīrán xiàyǔ le, dànshì tā háishi lái le.", "en": "It rained, but he still came.", "words": ["虽然", "下雨", "了", "但是", "他", "还是", "来", "了"], "marks": [[0, 2], [6, 8]]},
  {"zh": "虽然很贵，但是很好吃。", "py": "Suīrán hěn guì, dànshì hěn hǎochī.", "en": "It's expensive, but it's delicious.", "words": ["虽然", "很", "贵", "但是", "很", "好吃"], "marks": [[0, 2], [5, 7]]},
  {"zh": "虽然他很忙，但是经常来看我。", "py": "Suīrán tā hěn máng, dànshì jīngcháng lái kàn wǒ.", "en": "He's busy, but he often comes to see me.", "words": ["虽然", "他", "很", "忙", "但是", "经常", "来", "看", "我"], "marks": [[0, 2], [6, 8]]},
  {"zh": "虽然汉语很难，但是很有意思。", "py": "Suīrán Hànyǔ hěn nán, dànshì hěn yǒu yìsi.", "en": "Chinese is hard, but it's interesting.", "words": ["虽然", "汉语", "很", "难", "但是", "很", "有", "意思"], "marks": [[0, 2], [7, 9]]},
  {"zh": "虽然房间小，但是很干净。", "py": "Suīrán fángjiān xiǎo, dànshì hěn gānjìng.", "en": "The room is small, but it's clean.", "words": ["虽然", "房间", "小", "但是", "很", "干净"], "marks": [[0, 2], [6, 8]]}
 ]},
 {"id": "p08", "lv": 3, "label": "把", "en": "(do something) to an object", "note": ["Puts the object before the verb: what you do to it.", "A 把 thing + verb + result: 把灯关上。"], "near": ["p05"], "sentences": [
  {"zh": "请把手机给我。", "py": "Qǐng bǎ shǒujī gěi wǒ.", "en": "Please give me the phone.", "words": ["请", "把", "手机", "给", "我"], "marks": [[1, 2]]},
  {"zh": "他把水喝完了。", "py": "Tā bǎ shuǐ hē wán le.", "en": "He drank up the water.", "words": ["他", "把", "水", "喝", "完", "了"], "marks": [[1, 2]]},
  {"zh": "我把作业写完了。", "py": "Wǒ bǎ zuòyè xiě wán le.", "en": "I finished my homework.", "words": ["我", "把", "作业", "写", "完", "了"], "marks": [[1, 2]]},
  {"zh": "请把衣服洗干净。", "py": "Qǐng bǎ yīfu xǐ gānjìng.", "en": "Please wash the clothes clean.", "words": ["请", "把", "衣服", "洗", "干净"], "marks": [[1, 2]]},
  {"zh": "妈妈把菜放进冰箱了。", "py": "Māma bǎ cài fàng jìn bīngxiāng le.", "en": "Mom put the food in the fridge.", "words": ["妈妈", "把", "菜", "放", "进", "冰箱", "了"], "marks": [[2, 3]]},
  {"zh": "你把药吃了吗？", "py": "Nǐ bǎ yào chī le ma?", "en": "Did you take the medicine?", "words": ["你", "把", "药", "吃", "了", "吗"], "marks": [[1, 2]]},
  {"zh": "请把门关好。", "py": "Qǐng bǎ mén guān hǎo.", "en": "Please shut the door properly.", "words": ["请", "把", "门", "关", "好"], "marks": [[1, 2]]}
 ]},
 {"id": "p09", "lv": 3, "label": "被", "en": "(passive) by", "note": ["Passive: something is done to the subject.", "thing 被 (doer) + verb + result"], "sentences": [
  {"zh": "我的自行车被朋友借走了。", "py": "Wǒ de zìxíngchē bèi péngyou jiè zǒu le.", "en": "My bike was borrowed by a friend.", "words": ["我", "的", "自行车", "被", "朋友", "借", "走", "了"], "marks": [[5, 6]]},
  {"zh": "蛋糕被弟弟吃完了。", "py": "Dàngāo bèi dìdi chī wán le.", "en": "The cake was eaten up by my little brother.", "words": ["蛋糕", "被", "弟弟", "吃", "完", "了"], "marks": [[2, 3]]},
  {"zh": "鱼被猫吃了。", "py": "Yú bèi māo chī le.", "en": "The fish was eaten by the cat.", "words": ["鱼", "被", "猫", "吃", "了"], "marks": [[1, 2]]},
  {"zh": "我的钱被他花完了。", "py": "Wǒ de qián bèi tā huā wán le.", "en": "He spent all my money.", "words": ["我", "的", "钱", "被", "他", "花", "完", "了"], "marks": [[3, 4]]},
  {"zh": "我的伞被人拿走了。", "py": "Wǒ de sǎn bèi rén ná zǒu le.", "en": "Someone took my umbrella.", "words": ["我", "的", "伞", "被", "人", "拿", "走", "了"], "marks": [[3, 4]]},
  {"zh": "我的面包被狗吃了。", "py": "Wǒ de miànbāo bèi gǒu chī le.", "en": "The dog ate my bread.", "words": ["我", "的", "面包", "被", "狗", "吃", "了"], "marks": [[4, 5]]}
 ]},
 {"id": "p10", "lv": 3, "label": "越来越", "en": "more and more", "note": ["Something keeps getting more so.", "越来越 + adjective: 天气越来越热。"], "sentences": [
  {"zh": "天气越来越热了。", "py": "Tiānqì yuèláiyuè rè le.", "en": "It's getting hotter and hotter.", "words": ["天气", "越来越", "热", "了"], "marks": [[2, 5]]},
  {"zh": "她越来越漂亮了。", "py": "Tā yuèláiyuè piàoliang le.", "en": "She's getting prettier and prettier.", "words": ["她", "越来越", "漂亮", "了"], "marks": [[1, 4]]},
  {"zh": "我的汉语越来越好。", "py": "Wǒ de Hànyǔ yuèláiyuè hǎo.", "en": "My Chinese keeps getting better.", "words": ["我", "的", "汉语", "越来越", "好"], "marks": [[4, 7]]},
  {"zh": "东西越来越贵了。", "py": "Dōngxi yuèláiyuè guì le.", "en": "Things are getting more and more expensive.", "words": ["东西", "越来越", "贵", "了"], "marks": [[2, 5]]},
  {"zh": "孩子越来越高了。", "py": "Háizi yuèláiyuè gāo le.", "en": "The kids are getting taller and taller.", "words": ["孩子", "越来越", "高", "了"], "marks": [[2, 5]]},
  {"zh": "他越来越忙了。", "py": "Tā yuèláiyuè máng le.", "en": "He's getting busier and busier.", "words": ["他", "越来越", "忙", "了"], "marks": [[1, 4]]},
  {"zh": "来这儿的人越来越多。", "py": "Lái zhèr de rén yuèláiyuè duō.", "en": "More and more people come here.", "words": ["来", "这儿", "的", "人", "越来越", "多"], "marks": [[5, 8]]}
 ]},
 {"id": "p11", "lv": 3, "label": "一边…一边", "en": "while (two things at once)", "note": ["Two actions at the same time.", "一边 A 一边 B: 一边走一边唱。"], "sentences": [
  {"zh": "他一边走一边唱歌。", "py": "Tā yībiān zǒu yībiān chànggē.", "en": "He sings as he walks.", "words": ["他", "一边", "走", "一边", "唱歌"], "marks": [[1, 3], [4, 6]]},
  {"zh": "我们一边喝茶一边看书。", "py": "Wǒmen yībiān hē chá yībiān kàn shū.", "en": "We drink tea while we read.", "words": ["我们", "一边", "喝", "茶", "一边", "看", "书"], "marks": [[2, 4], [6, 8]]},
  {"zh": "妈妈一边做菜一边听音乐。", "py": "Māma yībiān zuò cài yībiān tīng yīnyuè.", "en": "Mom listens to music while she cooks.", "words": ["妈妈", "一边", "做", "菜", "一边", "听", "音乐"], "marks": [[2, 4], [6, 8]]},
  {"zh": "别一边吃一边说话。", "py": "Bié yībiān chī yībiān shuōhuà.", "en": "Don't talk while you eat.", "words": ["别", "一边", "吃", "一边", "说话"], "marks": [[1, 3], [4, 6]]},
  {"zh": "他一边看手机一边走路。", "py": "Tā yībiān kàn shǒujī yībiān zǒulù.", "en": "He looks at his phone while he walks.", "words": ["他", "一边", "看", "手机", "一边", "走路"], "marks": [[1, 3], [6, 8]]},
  {"zh": "我一边工作一边学习。", "py": "Wǒ yībiān gōngzuò yībiān xuéxí.", "en": "I work and study at the same time.", "words": ["我", "一边", "工作", "一边", "学习"], "marks": [[1, 3], [5, 7]]},
  {"zh": "爸爸一边看报纸一边喝咖啡。", "py": "Bàba yībiān kàn bàozhǐ yībiān hē kāfēi.", "en": "Dad drinks coffee while he reads the paper.", "words": ["爸爸", "一边", "看", "报纸", "一边", "喝", "咖啡"], "marks": [[2, 4], [7, 9]]}
 ]},
 {"id": "p12", "lv": 3, "label": "如果…就", "en": "if … then", "note": ["States a condition and what follows from it.", "如果 A，(subject) 就 B"], "near": ["p04", "p13", "p14", "p16", "p19", "p20", "p23", "p25"], "sentences": [
  {"zh": "如果下雨，我就不去了。", "py": "Rúguǒ xiàyǔ, wǒ jiù bù qù le.", "en": "If it rains, I won't go.", "words": ["如果", "下雨", "我", "就", "不", "去", "了"], "marks": [[0, 2], [6, 7]]},
  {"zh": "如果你累了，就休息吧。", "py": "Rúguǒ nǐ lèi le, jiù xiūxi ba.", "en": "If you're tired, have a rest.", "words": ["如果", "你", "累", "了", "就", "休息", "吧"], "marks": [[0, 2], [6, 7]]},
  {"zh": "如果有问题，就问我。", "py": "Rúguǒ yǒu wèntí, jiù wèn wǒ.", "en": "If you have a question, ask me.", "words": ["如果", "有", "问题", "就", "问", "我"], "marks": [[0, 2], [6, 7]]},
  {"zh": "如果你喜欢，就买吧。", "py": "Rúguǒ nǐ xǐhuan, jiù mǎi ba.", "en": "If you like it, buy it.", "words": ["如果", "你", "喜欢", "就", "买", "吧"], "marks": [[0, 2], [6, 7]]},
  {"zh": "如果明天天气好，我们就去爬山。", "py": "Rúguǒ míngtiān tiānqì hǎo, wǒmen jiù qù páshān.", "en": "If the weather is good tomorrow, we'll go hiking.", "words": ["如果", "明天", "天气", "好", "我们", "就", "去", "爬山"], "marks": [[0, 2], [10, 11]]},
  {"zh": "如果你饿了，就先吃吧。", "py": "Rúguǒ nǐ è le, jiù xiān chī ba.", "en": "If you're hungry, go ahead and eat.", "words": ["如果", "你", "饿", "了", "就", "先", "吃", "吧"], "marks": [[0, 2], [6, 7]]},
  {"zh": "如果他不来，我就给他打电话。", "py": "Rúguǒ tā bù lái, wǒ jiù gěi tā dǎdiànhuà.", "en": "If he doesn't come, I'll call him.", "words": ["如果", "他", "不", "来", "我", "就", "给", "他", "打电话"], "marks": [[0, 2], [7, 8]]}
 ]},
 {"id": "p13", "lv": 3, "label": "先…然后", "en": "first … then", "note": ["Puts two actions in order.", "先 A，然后 B"], "near": ["p12", "p14", "p15", "p16", "p19", "p23", "p25"], "sentences": [
  {"zh": "我先洗澡，然后睡觉。", "py": "Wǒ xiān xǐzǎo, ránhòu shuìjiào.", "en": "I'll shower first, then go to bed.", "words": ["我", "先", "洗澡", "然后", "睡觉"], "marks": [[1, 2], [5, 7]]},
  {"zh": "先吃东西，然后去看电影。", "py": "Xiān chī dōngxi, ránhòu qù kàn diànyǐng.", "en": "Let's eat first, then see a movie.", "words": ["先", "吃", "东西", "然后", "去", "看", "电影"], "marks": [[0, 1], [5, 7]]},
  {"zh": "你先休息，然后再工作。", "py": "Nǐ xiān xiūxi, ránhòu zài gōngzuò.", "en": "Rest first, then get back to work.", "words": ["你", "先", "休息", "然后", "再", "工作"], "marks": [[1, 2], [5, 7]]},
  {"zh": "我们先去超市，然后回家。", "py": "Wǒmen xiān qù chāoshì, ránhòu huí jiā.", "en": "We'll go to the supermarket first, then home.", "words": ["我们", "先", "去", "超市", "然后", "回", "家"], "marks": [[2, 3], [7, 9]]},
  {"zh": "先复习，然后做作业。", "py": "Xiān fùxí, ránhòu zuò zuòyè.", "en": "Review first, then do the homework.", "words": ["先", "复习", "然后", "做", "作业"], "marks": [[0, 1], [4, 6]]},
  {"zh": "我们先坐地铁，然后走路回家。", "py": "Wǒmen xiān zuò dìtiě, ránhòu zǒulù huí jiā.", "en": "We'll take the subway first, then walk home.", "words": ["我们", "先", "坐", "地铁", "然后", "走路", "回", "家"], "marks": [[2, 3], [7, 9]]}
 ]},
 {"id": "p14", "lv": 3, "label": "又…又", "en": "both … and …", "note": ["Two qualities at once.", "又 A 又 B: 又便宜又好吃。"], "sentences": [
  {"zh": "这个苹果又大又甜。", "py": "Zhège píngguǒ yòu dà yòu tián.", "en": "This apple is big and sweet.", "words": ["这个", "苹果", "又", "大", "又", "甜"], "marks": [[4, 5], [6, 7]]},
  {"zh": "他的房间又小又旧。", "py": "Tā de fángjiān yòu xiǎo yòu jiù.", "en": "His room is small and old.", "words": ["他", "的", "房间", "又", "小", "又", "旧"], "marks": [[4, 5], [6, 7]]},
  {"zh": "那个饭馆又便宜又好吃。", "py": "Nàge fànguǎn yòu piányi yòu hǎochī.", "en": "That restaurant is cheap and good.", "words": ["那个", "饭馆", "又", "便宜", "又", "好吃"], "marks": [[4, 5], [7, 8]]},
  {"zh": "她又聪明又漂亮。", "py": "Tā yòu cōngming yòu piàoliang.", "en": "She's smart and pretty.", "words": ["她", "又", "聪明", "又", "漂亮"], "marks": [[1, 2], [4, 5]]},
  {"zh": "我今天又饿又累。", "py": "Wǒ jīntiān yòu è yòu lèi.", "en": "I'm hungry and tired today.", "words": ["我", "今天", "又", "饿", "又", "累"], "marks": [[3, 4], [5, 6]]},
  {"zh": "这个公园又大又安静。", "py": "Zhège gōngyuán yòu dà yòu ānjìng.", "en": "This park is big and quiet.", "words": ["这个", "公园", "又", "大", "又", "安静"], "marks": [[4, 5], [6, 7]]},
  {"zh": "他又高又瘦。", "py": "Tā yòu gāo yòu shòu.", "en": "He's tall and thin.", "words": ["他", "又", "高", "又", "瘦"], "marks": [[1, 2], [3, 4]]}
 ]},
 {"id": "p15", "lv": 4, "label": "一…就", "en": "as soon as", "note": ["One action follows right after another.", "一 A 就 B"], "near": ["p13", "p14", "p23", "p25"], "sentences": [
  {"zh": "我一到家就睡觉了。", "py": "Wǒ yī dào jiā jiù shuìjiào le.", "en": "I went to bed as soon as I got home.", "words": ["我", "一", "到", "家", "就", "睡觉", "了"], "marks": [[1, 2], [4, 5]]},
  {"zh": "他一看见我就笑了。", "py": "Tā yī kànjiàn wǒ jiù xiào le.", "en": "He smiled as soon as he saw me.", "words": ["他", "一", "看见", "我", "就", "笑", "了"], "marks": [[1, 2], [5, 6]]},
  {"zh": "她一起床就喝咖啡。", "py": "Tā yī qǐchuáng jiù hē kāfēi.", "en": "She drinks coffee as soon as she gets up.", "words": ["她", "一", "起床", "就", "喝", "咖啡"], "marks": [[1, 2], [4, 5]]},
  {"zh": "孩子一哭，妈妈就来了。", "py": "Háizi yī kū, māma jiù lái le.", "en": "As soon as the baby cries, Mom comes.", "words": ["孩子", "一", "哭", "妈妈", "就", "来", "了"], "marks": [[2, 3], [7, 8]]},
  {"zh": "我一听就懂了。", "py": "Wǒ yī tīng jiù dǒng le.", "en": "I understood as soon as I heard it.", "words": ["我", "一", "听", "就", "懂", "了"], "marks": [[1, 2], [3, 4]]},
  {"zh": "他一有钱就去旅游。", "py": "Tā yī yǒu qián jiù qù lǚyóu.", "en": "As soon as he has money, he travels.", "words": ["他", "一", "有", "钱", "就", "去", "旅游"], "marks": [[1, 2], [4, 5]]}
 ]},
 {"id": "p16", "lv": 4, "label": "只要…就", "en": "as long as", "note": ["One condition is enough for the result.", "只要 A，就 B"], "near": ["p04", "p12", "p19"], "sentences": [
  {"zh": "只要努力，就能成功。", "py": "Zhǐyào nǔlì, jiù néng chénggōng.", "en": "As long as you work hard, you'll succeed.", "words": ["只要", "努力", "就", "能", "成功"], "marks": [[0, 2]]},
  {"zh": "只要你来，我就高兴。", "py": "Zhǐyào nǐ lái, wǒ jiù gāoxìng.", "en": "As long as you come, I'm happy.", "words": ["只要", "你", "来", "我", "就", "高兴"], "marks": [[0, 2]]},
  {"zh": "只要有时间，我就去看你。", "py": "Zhǐyào yǒu shíjiān, wǒ jiù qù kàn nǐ.", "en": "As long as I have time, I'll come and see you.", "words": ["只要", "有", "时间", "我", "就", "去", "看", "你"], "marks": [[0, 2]]},
  {"zh": "只要多练习，汉语就会好。", "py": "Zhǐyào duō liànxí, Hànyǔ jiù huì hǎo.", "en": "With enough practice, your Chinese will get good.", "words": ["只要", "多", "练习", "汉语", "就", "会", "好"], "marks": [[0, 2]]},
  {"zh": "只要不下雨，我们就去。", "py": "Zhǐyào bù xiàyǔ, wǒmen jiù qù.", "en": "As long as it doesn't rain, we'll go.", "words": ["只要", "不", "下雨", "我们", "就", "去"], "marks": [[0, 2]]},
  {"zh": "只要你喜欢，就送给你。", "py": "Zhǐyào nǐ xǐhuan, jiù sòng gěi nǐ.", "en": "As long as you like it, it's yours.", "words": ["只要", "你", "喜欢", "就", "送", "给", "你"], "marks": [[0, 2]]}
 ]},
 {"id": "p17", "lv": 4, "label": "不管…都", "en": "no matter …", "note": ["The result holds in every case.", "不管 + question word or choice，都 B"], "near": ["p20"], "sentences": [
  {"zh": "不管多忙，他都去锻炼。", "py": "Bùguǎn duō máng, tā dōu qù duànliàn.", "en": "However busy he is, he still works out.", "words": ["不管", "多", "忙", "他", "都", "去", "锻炼"], "marks": [[0, 2]]},
  {"zh": "不管你去哪儿，我都跟你去。", "py": "Bùguǎn nǐ qù nǎr, wǒ dōu gēn nǐ qù.", "en": "Wherever you go, I'll go with you.", "words": ["不管", "你", "去", "哪儿", "我", "都", "跟", "你", "去"], "marks": [[0, 2]]},
  {"zh": "不管多贵，我都要买。", "py": "Bùguǎn duō guì, wǒ dōu yào mǎi.", "en": "However expensive it is, I'll buy it.", "words": ["不管", "多", "贵", "我", "都", "要", "买"], "marks": [[0, 2]]},
  {"zh": "不管谁来，我都不开门。", "py": "Bùguǎn shéi lái, wǒ dōu bù kāi mén.", "en": "Whoever comes, I won't open the door.", "words": ["不管", "谁", "来", "我", "都", "不", "开", "门"], "marks": [[0, 2]]},
  {"zh": "不管做什么，他都很认真。", "py": "Bùguǎn zuò shénme, tā dōu hěn rènzhēn.", "en": "Whatever he does, he takes it seriously.", "words": ["不管", "做", "什么", "他", "都", "很", "认真"], "marks": [[0, 2]]},
  {"zh": "不管什么时候，你都可以来。", "py": "Bùguǎn shénme shíhou, nǐ dōu kěyǐ lái.", "en": "You can come any time.", "words": ["不管", "什么", "时候", "你", "都", "可以", "来"], "marks": [[0, 2]]}
 ]},
 {"id": "p18", "lv": 4, "label": "连…也/都", "en": "even", "note": ["Stresses an extreme case: even this.", "连 X 也/都 + verb"], "near": ["p14"], "sentences": [
  {"zh": "我连他的名字都不知道。", "py": "Wǒ lián tā de míngzi dōu bù zhīdào.", "en": "I don't even know his name.", "words": ["我", "连", "他", "的", "名字", "都", "不", "知道"], "marks": [[1, 2]]},
  {"zh": "我连一分钟也没休息。", "py": "Wǒ lián yī fēnzhōng yě méi xiūxi.", "en": "I haven't rested even for a minute.", "words": ["我", "连", "一", "分钟", "也", "没", "休息"], "marks": [[1, 2]]},
  {"zh": "这个题连老师也不会。", "py": "Zhège tí lián lǎoshī yě bù huì.", "en": "Even the teacher can't do this question.", "words": ["这个", "题", "连", "老师", "也", "不", "会"], "marks": [[3, 4]]},
  {"zh": "她连一个字也不认识。", "py": "Tā lián yī gè zì yě bù rènshi.", "en": "She can't read a single character.", "words": ["她", "连", "一", "个", "字", "也", "不", "认识"], "marks": [[1, 2]]},
  {"zh": "连孩子都知道这个。", "py": "Lián háizi dōu zhīdào zhège.", "en": "Even children know this.", "words": ["连", "孩子", "都", "知道", "这个"], "marks": [[0, 1]]},
  {"zh": "他连一块钱都没有。", "py": "Tā lián yī kuài qián dōu méi yǒu.", "en": "He doesn't even have one yuan.", "words": ["他", "连", "一", "块", "钱", "都", "没", "有"], "marks": [[1, 2]]}
 ]},
 {"id": "p19", "lv": 4, "label": "既然…就", "en": "since (given that) … then", "note": ["Takes a known fact as the reason.", "既然 A，就 B"], "near": ["p04", "p12", "p16"], "sentences": [
  {"zh": "既然你生病了，就在家休息吧。", "py": "Jìrán nǐ shēngbìng le, jiù zài jiā xiūxi ba.", "en": "Since you're sick, rest at home.", "words": ["既然", "你", "生病", "了", "就", "在", "家", "休息", "吧"], "marks": [[0, 2]]},
  {"zh": "既然来了，就进来坐坐。", "py": "Jìrán lái le, jiù jìnlai zuòzuo.", "en": "Since you're here, come in and sit down.", "words": ["既然", "来", "了", "就", "进来", "坐坐"], "marks": [[0, 2]]},
  {"zh": "既然你不喜欢，就别买了。", "py": "Jìrán nǐ bù xǐhuan, jiù bié mǎi le.", "en": "Since you don't like it, don't buy it.", "words": ["既然", "你", "不", "喜欢", "就", "别", "买", "了"], "marks": [[0, 2]]},
  {"zh": "既然下雨了，我们就不去了。", "py": "Jìrán xiàyǔ le, wǒmen jiù bù qù le.", "en": "Since it's raining, we won't go.", "words": ["既然", "下雨", "了", "我们", "就", "不", "去", "了"], "marks": [[0, 2]]},
  {"zh": "既然他不来，我们就先吃吧。", "py": "Jìrán tā bù lái, wǒmen jiù xiān chī ba.", "en": "Since he isn't coming, let's eat.", "words": ["既然", "他", "不", "来", "我们", "就", "先", "吃", "吧"], "marks": [[0, 2]]},
  {"zh": "既然知道错了，就要道歉。", "py": "Jìrán zhīdào cuò le, jiù yào dàoqiàn.", "en": "Since you know you were wrong, apologize.", "words": ["既然", "知道", "错", "了", "就", "要", "道歉"], "marks": [[0, 2]]}
 ]},
 {"id": "p20", "lv": 4, "label": "即使…也", "en": "even if", "note": ["Even in that case, the result stays the same.", "即使 A，也 B"], "near": ["p04", "p07", "p12", "p16", "p17", "p19"], "sentences": [
  {"zh": "即使下雨，我也要去。", "py": "Jíshǐ xiàyǔ, wǒ yě yào qù.", "en": "Even if it rains, I'm going.", "words": ["即使", "下雨", "我", "也", "要", "去"], "marks": [[0, 2]]},
  {"zh": "即使很累，他也不休息。", "py": "Jíshǐ hěn lèi, tā yě bù xiūxi.", "en": "Even when he's tired, he doesn't rest.", "words": ["即使", "很", "累", "他", "也", "不", "休息"], "marks": [[0, 2]]},
  {"zh": "即使没有钱，我也很快乐。", "py": "Jíshǐ méi yǒu qián, wǒ yě hěn kuàilè.", "en": "Even without money, I'm happy.", "words": ["即使", "没", "有", "钱", "我", "也", "很", "快乐"], "marks": [[0, 2]]},
  {"zh": "即使他错了，你也别生气。", "py": "Jíshǐ tā cuò le, nǐ yě bié shēngqì.", "en": "Even if he's wrong, don't get angry.", "words": ["即使", "他", "错", "了", "你", "也", "别", "生气"], "marks": [[0, 2]]},
  {"zh": "即使很难，我也不放弃。", "py": "Jíshǐ hěn nán, wǒ yě bù fàngqì.", "en": "Even if it's hard, I won't give up.", "words": ["即使", "很", "难", "我", "也", "不", "放弃"], "marks": [[0, 2]]},
  {"zh": "即使明天下雪，我们也要出发。", "py": "Jíshǐ míngtiān xiàxuě, wǒmen yě yào chūfā.", "en": "Even if it snows tomorrow, we'll set off.", "words": ["即使", "明天", "下雪", "我们", "也", "要", "出发"], "marks": [[0, 2]]}
 ]},
 {"id": "p21", "lv": 4, "label": "看起来", "en": "looks, seems", "note": ["Gives an impression: looks, sounds, seems.", "看起来 / 听起来 + adjective"], "sentences": [
  {"zh": "你看起来很累。", "py": "Nǐ kàn qǐlai hěn lèi.", "en": "You look tired.", "words": ["你", "看", "起来", "很", "累"], "marks": [[2, 4]]},
  {"zh": "这个菜看起来很好吃。", "py": "Zhège cài kàn qǐlai hěn hǎochī.", "en": "This dish looks delicious.", "words": ["这个", "菜", "看", "起来", "很", "好吃"], "marks": [[4, 6]]},
  {"zh": "听起来很有意思。", "py": "Tīng qǐlai hěn yǒu yìsi.", "en": "That sounds interesting.", "words": ["听", "起来", "很", "有", "意思"], "marks": [[1, 3]]},
  {"zh": "他看起来很年轻。", "py": "Tā kàn qǐlai hěn niánqīng.", "en": "He looks young.", "words": ["他", "看", "起来", "很", "年轻"], "marks": [[2, 4]]},
  {"zh": "这件衣服穿起来很舒服。", "py": "Zhè jiàn yīfu chuān qǐlai hěn shūfu.", "en": "These clothes are comfortable to wear.", "words": ["这", "件", "衣服", "穿", "起来", "很", "舒服"], "marks": [[5, 7]]},
  {"zh": "这个问题看起来很简单。", "py": "Zhège wèntí kàn qǐlai hěn jiǎndān.", "en": "This question looks easy.", "words": ["这个", "问题", "看", "起来", "很", "简单"], "marks": [[5, 7]]},
  {"zh": "她笑起来很漂亮。", "py": "Tā xiào qǐlai hěn piàoliang.", "en": "She looks lovely when she smiles.", "words": ["她", "笑", "起来", "很", "漂亮"], "marks": [[2, 4]]}
 ]},
 {"id": "p22", "lv": 4, "label": "越…越", "en": "the more … the more", "note": ["One thing grows as another grows.", "越 A 越 B: 越看越喜欢。"], "near": ["p14"], "sentences": [
  {"zh": "雪越下越大。", "py": "Xuě yuè xià yuè dà.", "en": "The snow is getting heavier.", "words": ["雪", "越", "下", "越", "大"], "marks": [[1, 2], [3, 4]]},
  {"zh": "我越看越喜欢。", "py": "Wǒ yuè kàn yuè xǐhuan.", "en": "The more I look, the more I like it.", "words": ["我", "越", "看", "越", "喜欢"], "marks": [[1, 2], [3, 4]]},
  {"zh": "他越走越快。", "py": "Tā yuè zǒu yuè kuài.", "en": "He walks faster and faster.", "words": ["他", "越", "走", "越", "快"], "marks": [[1, 2], [3, 4]]},
  {"zh": "这本书越读越有意思。", "py": "Zhè běn shū yuè dú yuè yǒu yìsi.", "en": "This book gets better the more I read.", "words": ["这", "本", "书", "越", "读", "越", "有", "意思"], "marks": [[3, 4], [5, 6]]},
  {"zh": "她越想越生气。", "py": "Tā yuè xiǎng yuè shēngqì.", "en": "The more she thought, the angrier she got.", "words": ["她", "越", "想", "越", "生气"], "marks": [[1, 2], [3, 4]]},
  {"zh": "他越吃越胖。", "py": "Tā yuè chī yuè pàng.", "en": "The more he eats, the fatter he gets.", "words": ["他", "越", "吃", "越", "胖"], "marks": [[1, 2], [3, 4]]}
 ]},
 {"id": "p23", "lv": 4, "label": "才 vs 就", "en": "only then (late) vs already (early)", "note": ["就: sooner or easier than expected. 才: later or harder.", "六点就起床了 · 十点才起床"], "near": ["p13", "p14", "p25"], "sentences": [
  {"zh": "都十点了，他才起床。", "py": "Dōu shí diǎn le, tā cái qǐchuáng.", "en": "It was already ten and he only then got up.", "words": ["都", "十", "点", "了", "他", "才", "起床"], "marks": [[6, 7]]},
  {"zh": "我六点就起床了。", "py": "Wǒ liù diǎn jiù qǐchuáng le.", "en": "I was up at six already.", "words": ["我", "六", "点", "就", "起床", "了"], "marks": [[3, 4]]},
  {"zh": "都十二点了，她才回家。", "py": "Dōu shí'èr diǎn le, tā cái huí jiā.", "en": "It was twelve already when she finally got home.", "words": ["都", "十二", "点", "了", "她", "才", "回", "家"], "marks": [[7, 8]]},
  {"zh": "他五分钟就做完了。", "py": "Tā wǔ fēnzhōng jiù zuò wán le.", "en": "He was done in just five minutes.", "words": ["他", "五", "分钟", "就", "做", "完", "了"], "marks": [[4, 5]]},
  {"zh": "我等了一个小时他才来。", "py": "Wǒ děng le yī gè xiǎoshí tā cái lái.", "en": "I waited an hour before he finally came.", "words": ["我", "等", "了", "一", "个", "小时", "他", "才", "来"], "marks": [[8, 9]]},
  {"zh": "过了很久，他才说话。", "py": "Guò le hěn jiǔ, tā cái shuōhuà.", "en": "It was a long time before he spoke.", "words": ["过", "了", "很", "久", "他", "才", "说话"], "marks": [[6, 7]]},
  {"zh": "我们很快就到了。", "py": "Wǒmen hěn kuài jiù dào le.", "en": "We got there in no time.", "words": ["我们", "很", "快", "就", "到", "了"], "marks": [[4, 5]]}
 ]},
 {"id": "p24", "lv": 4, "label": "难道", "en": "surely … not? (rhetorical)", "note": ["A rhetorical question: shows surprise or doubt.", "难道 … 吗？"], "sentences": [
  {"zh": "你难道不知道吗？", "py": "Nǐ nándào bù zhīdào ma?", "en": "Don't tell me you don't know!", "words": ["你", "难道", "不", "知道", "吗"], "marks": [[1, 3]]},
  {"zh": "他难道是你哥哥吗？", "py": "Tā nándào shì nǐ gēge ma?", "en": "Could he be your older brother?", "words": ["他", "难道", "是", "你", "哥哥", "吗"], "marks": [[1, 3]]},
  {"zh": "你难道忘记了吗？", "py": "Nǐ nándào wàngjì le ma?", "en": "Did you really forget?", "words": ["你", "难道", "忘记", "了", "吗"], "marks": [[1, 3]]},
  {"zh": "这难道是真的吗？", "py": "Zhè nándào shì zhēn de ma?", "en": "Can this really be true?", "words": ["这", "难道", "是", "真", "的", "吗"], "marks": [[1, 3]]},
  {"zh": "你难道不想去吗？", "py": "Nǐ nándào bù xiǎng qù ma?", "en": "Don't you want to go?", "words": ["你", "难道", "不", "想", "去", "吗"], "marks": [[1, 3]]},
  {"zh": "我难道错了吗？", "py": "Wǒ nándào cuò le ma?", "en": "Was I really wrong?", "words": ["我", "难道", "错", "了", "吗"], "marks": [[1, 3]]}
 ]},
 {"id": "p25", "lv": 4, "label": "听得懂 / 听不懂", "en": "can / can't (manage to)", "note": ["Says whether you can manage a result.", "verb + 得/不 + result: 听得懂 · 听不懂"], "near": ["p12", "p13", "p14", "p15", "p16", "p19", "p23"], "sentences": [
  {"zh": "老师说话很慢，我听得懂。", "py": "Lǎoshī shuōhuà hěn màn, wǒ tīng de dǒng.", "en": "The teacher speaks slowly, so I can understand.", "words": ["老师", "说话", "很", "慢", "我", "听", "得", "懂"], "marks": [[9, 10]]},
  {"zh": "太快了，我听不懂。", "py": "Tài kuài le, wǒ tīng bù dǒng.", "en": "It's too fast, I can't follow.", "words": ["太", "快", "了", "我", "听", "不", "懂"], "marks": [[6, 7]]},
  {"zh": "这个字很简单，我看得懂。", "py": "Zhège zì hěn jiǎndān, wǒ kàn de dǒng.", "en": "This character is easy; I can read it.", "words": ["这个", "字", "很", "简单", "我", "看", "得", "懂"], "marks": [[9, 10]]},
  {"zh": "太远了，我看不清楚。", "py": "Tài yuǎn le, wǒ kàn bù qīngchu.", "en": "It's too far, I can't see clearly.", "words": ["太", "远", "了", "我", "看", "不", "清楚"], "marks": [[6, 7]]},
  {"zh": "菜太多了，我吃不完。", "py": "Cài tài duō le, wǒ chī bù wán.", "en": "There's too much food, I can't finish it.", "words": ["菜", "太", "多", "了", "我", "吃", "不", "完"], "marks": [[7, 8]]},
  {"zh": "作业不多，我做得完。", "py": "Zuòyè bù duō, wǒ zuò de wán.", "en": "There isn't much homework; I can finish it.", "words": ["作业", "不", "多", "我", "做", "得", "完"], "marks": [[7, 8]]},
  {"zh": "我找了很久，还是找不到。", "py": "Wǒ zhǎo le hěn jiǔ, háishi zhǎo bù dào.", "en": "I looked for ages and still can't find it.", "words": ["我", "找", "了", "很", "久", "还是", "找", "不", "到"], "marks": [[9, 10]]}
 ]},
 {"id": "p26", "lv": 4, "label": "不但…而且", "en": "not only … but also", "note": ["Adds a second, stronger point.", "不但 A，而且 B"], "near": ["p04", "p07", "p12", "p16", "p17", "p19", "p20"], "sentences": [
  {"zh": "这里不但便宜，而且很方便。", "py": "Zhèlǐ bùdàn piányi, érqiě hěn fāngbiàn.", "en": "It's not only cheap here but convenient too.", "words": ["这里", "不但", "便宜", "而且", "很", "方便"], "marks": [[2, 4], [7, 9]]},
  {"zh": "她不但漂亮，而且很聪明。", "py": "Tā bùdàn piàoliang, érqiě hěn cōngming.", "en": "She's not only pretty but smart too.", "words": ["她", "不但", "漂亮", "而且", "很", "聪明"], "marks": [[1, 3], [6, 8]]},
  {"zh": "他不但会唱歌，而且会跳舞。", "py": "Tā bùdàn huì chànggē, érqiě huì tiàowǔ.", "en": "He can not only sing but dance too.", "words": ["他", "不但", "会", "唱歌", "而且", "会", "跳舞"], "marks": [[1, 3], [7, 9]]},
  {"zh": "这个菜不但香，而且不贵。", "py": "Zhège cài bùdàn xiāng, érqiě bù guì.", "en": "This dish not only smells good, it's cheap too.", "words": ["这个", "菜", "不但", "香", "而且", "不", "贵"], "marks": [[3, 5], [7, 9]]},
  {"zh": "我不但很累，而且很饿。", "py": "Wǒ bùdàn hěn lèi, érqiě hěn è.", "en": "I'm not only tired but hungry too.", "words": ["我", "不但", "很", "累", "而且", "很", "饿"], "marks": [[1, 3], [6, 8]]},
  {"zh": "她不但学习好，而且身体好。", "py": "Tā bùdàn xuéxí hǎo, érqiě shēntǐ hǎo.", "en": "She not only does well at school but is healthy too.", "words": ["她", "不但", "学习", "好", "而且", "身体", "好"], "marks": [[1, 3], [7, 9]]}
 ]},
 {"id": "p27", "lv": 4, "label": "除了…以外", "en": "besides, except", "note": ["Besides X (also …), or except X (all …).", "除了 X 以外，… 也/还/都 …"], "sentences": [
  {"zh": "除了咖啡以外，我也喝茶。", "py": "Chúle kāfēi yǐwài, wǒ yě hē chá.", "en": "Besides coffee, I drink tea too.", "words": ["除了", "咖啡", "以外", "我", "也", "喝", "茶"], "marks": [[0, 2], [4, 6]]},
  {"zh": "除了他以外，大家都来了。", "py": "Chúle tā yǐwài, dàjiā dōu lái le.", "en": "Everyone came except him.", "words": ["除了", "他", "以外", "大家", "都", "来", "了"], "marks": [[0, 2], [3, 5]]},
  {"zh": "除了周末以外，我都要上班。", "py": "Chúle zhōumò yǐwài, wǒ dōu yào shàngbān.", "en": "I work every day except weekends.", "words": ["除了", "周末", "以外", "我", "都", "要", "上班"], "marks": [[0, 2], [4, 6]]},
  {"zh": "除了汉语以外，你还会什么？", "py": "Chúle Hànyǔ yǐwài, nǐ hái huì shénme?", "en": "Besides Chinese, what else do you know?", "words": ["除了", "汉语", "以外", "你", "还", "会", "什么"], "marks": [[0, 2], [4, 6]]},
  {"zh": "除了米饭以外，我还想要面条。", "py": "Chúle mǐfàn yǐwài, wǒ hái xiǎng yào miàntiáo.", "en": "Besides rice, I'd also like noodles.", "words": ["除了", "米饭", "以外", "我", "还", "想", "要", "面条"], "marks": [[0, 2], [4, 6]]},
  {"zh": "除了我以外，没人知道。", "py": "Chúle wǒ yǐwài, méi rén zhīdào.", "en": "Nobody knows except me.", "words": ["除了", "我", "以外", "没", "人", "知道"], "marks": [[0, 2], [3, 5]]}
 ]}
];
