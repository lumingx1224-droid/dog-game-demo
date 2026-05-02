import { _decorator, Component, Label, Button, Node, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

// ---------------------------------------------------------------------------
// 剧情数据结构
// ---------------------------------------------------------------------------

/** 单个选项：显示文字与跳转目标场景 id */
export interface StoryChoice {
    text: string;
    /** 下一个场景在 storyData 中的 key，例如 "scene2" */
    next: string;
}

/** 一个场景：分段文本（逐句推进） + 若干选项 */
export interface StoryScene {
    bg: string;
    dog: string;
    doctor?: string;
    doctorPos?: { x: number; y: number };
    doctorScale?: number;
    doctorScaleX?: number;
    doctorScaleY?: number;
    dogPos?: { x: number; y: number };
    dogScale?: number;
    dogScaleX?: number;
    dogScaleY?: number;
    /** 分段文本：每次点击只显示其中一段（不会累加显示） */
    texts: string[];
    choices: StoryChoice[];
}

/** 全部剧情：场景 id -> 场景数据 */
export type StoryData = Record<string, StoryScene>;

/**
 * 剧情数据表：通过 key 切换场景，choices 数量可为 1～3（或更多，但本组件只展示前 3 个）
 */
export const storyData: StoryData = {
    scene1: {
        bg: 'street',
        dog: '',
        texts: ['今天本来只是普通的一天。','下班有点晚，回家路上很安静。','突然，你听到一声很轻的呜咽...'],
        choices: [
            { text: '走近看看', next: 'scene2' },
            { text: '当做没听见，继续走', next: 'scene1_back' },
        ],
    },

    scene1_back: {
        bg: 'street',
        dog: '',
        texts: ['你走了两步。', '那声音还在。'],
        choices: [{ text: '回头看看', next: 'scene2' }],
    },

    scene2: {
        bg: 'corner',
        dog: 'blood',
        texts: ['"哇，是一只小狗"','角落里，一只脏兮兮的小狗蜷缩着。','它看见你，又往后缩了一下。', '他的脚好像受伤了。'],
        choices: [
            { text: '伸手摸摸他', next: 'scene3_approach' },
            { text: '先去买点吃的', next: 'scene3_food' },
        ],
    },

    scene3_approach: {
        bg: 'corner',
        dog: 'angry',
        dogPos: { x: 141, y: -682 },
        dogScaleX: 1,   // ✅ 精确控制
        texts: ['你刚靠近一步，它立刻紧张起来。','露出尖牙，喉咙发出呼呼的声音如同低吼。','...你停住了。'],
        choices: [
            { text: '还是去买点吃的吧', next: 'scene3_food' }
        ],
    },

    scene3_food: {
        bg: 'corner',
        dog: 'blood',
        texts: ['你去便利店买了点吃的。', '再回来的时候，它还在原地。', '你把食物放在地上。'],
        choices: [
             { text: '站着不动', next: 'scene4_not_eat' },
             { text: '退后一点', next: 'scene4_eat' },
        ],
    },

    scene4_not_eat: {
        bg: 'corner',
        dog: 'not_eat',
        dogPos: { x: -10, y: -682 },
        dogScaleX: 850 / 770,   // ✅ 精确控制
        texts: ['它看着食物，又看着你。', '犹豫着...'],
        choices: [{ text: '退后一点', next: 'scene4_eat' }],
    },

    scene4_eat: {
        bg: 'corner',
        dog: 'eat',
        dogPos: { x: -10, y: -682 },
        texts: ['你退开了一点。', '它慢慢靠近,低头开始吃东西。', '吃得很急,中途抬头看了你一眼。'],
        choices: [
            { text: '在旁边坐下', next: 'scene5_stay' },
            { text: '伸手摸摸他', next: 'scene3_approach' },
        ],
    },

    scene5_stay: {
        bg: 'corner',
        dog: 'full',
        texts: ['你坐在一旁。', '它吃完之后，没有离开。', '只是安静地待在那里'],
        choices: [
            { text: '伸手摸摸他', next: 'scene6_end' },
            { text: '再等等看', next: 'scene5_loop' },
        ],
    },

    scene5_loop: {
        bg: 'corner',
        dog: 'full',
        texts: ['你们都没有动。', '夜很安静。', '它没有走。', '你也没有离开。'],
        choices: [{ text: '伸手摸摸他', next: 'scene6_end' }],
    },

    scene6_end: {
        bg: 'corner',
        dog: 'touch',
        dogPos: { x: -252, y: -542 },
        texts: [
            '这次他竟然没有向我低吼',
            '低下头让我摸他',
            '他的前腿在渗血',
            '要不要带他去医院呢',
        ],
        choices: [{ text: '带他去医院', next: 'chapter_end' },
            { text: '太晚了，先抱它回家', next: 'chapter_not_end' },
        ],
    },
    chapter_not_end: {
        bg: 'corner',
        dog: 'hug_unconfortable',
        dogPos: { x: -4, y: -701 },
        dogScaleX: (1005 / 770)*1.5, 
        dogScaleY:1.5, 
        texts: ['抱起小狗走了两步。', '他似乎疼的发抖。'],
        choices: [{ text: '带他去医院', next: 'chapter_end_2' },],
    },
    
    chapter_end: {
        bg: 'corner',
        dog: 'hug',
        dogPos: { x: -4, y: -701 },
        dogScaleX: (1005 / 770)*1.5, 
        dogScaleY:1.5,  // 
        texts: ['抱起小狗的那一刻你还不知道。', '这只小狗，会改变你之后的很多天。'],
        choices: [],
    },
    chapter_end_2: {
        bg: 'corner',
        dog: 'hug',
        texts: ['你决定寻找宠物医院','那一刻你还不知道。', '这只小狗，会改变你之后的很多天。'],
        choices: [],
    },

    // ---------------- 第二章：医院 ----------------

    chapter2_start: {
        bg: 'corner',
        dog: 'hug',
        texts: [
            '你抱着它。',
            '很轻，比你想象中还轻。',
            '它没有挣扎。',
            '只是呼吸有点急。',
        ],
        choices: [{ text: '寻找宠物医院', next: 'c2_search' }],
    },

    c2_search: {
        bg: 'street_2',
        dog: '',
        texts: [
            '你抱着它走了两条街。',
            '接连走了两家医院，都关门了。',
            '它的呼吸比刚才更急了。',
            '要不要先带它回家，明天再说？',
        ],
        choices: [
            { text: '继续找', next: 'c2_keep_search' },
            { text: '先带回家', next: 'c2_go_home' },
        ],
    },

    c2_go_home: {
        bg: 'street_2',
        dog: 'hug_unconfortable',
        texts: [
            '你转身往回走。',
            '你发现它在你怀里微微发抖。',
            '它的伤口……',
            '你不确定，它的伤口明天会不会变得严重。',
        ],
        choices: [{ text: '还是去找医院', next: 'c2_keep_search' }],
    },

    c2_keep_search: {
        bg: 'hospital_outside',
        dog: '',
        texts: ['可算找到医院了。', '终于,你在拐角尽头找到一间亮着灯的医院。'],
        choices: [{ text: '推门进去', next: 'c2_hospital' }],
    },

    c2_hospital: {
        bg: 'hospital_inside',
        dog: '',
        texts: ['这是你第一次走进宠物医院', '有些手足无措。', '医生上前询问你发生了什么事。'],
        choices: [{ text: '把小狗交给医生', next: 'c2_check' }],
    },

    c2_check: {
        bg: 'hospital_inside_2',
        dog: '',
        doctor: 'check',
        doctorPos: { x: 117, y: -330 },
        doctorScale:859/649,
        texts: [
            '你告诉了医生在路边发现小狗的事情。',
            '医生接过它，仔细查看。',
            '它身体仍然在颤抖，喉咙里又发出呼呼的低吼。',
        ],
        choices: [{ text: '继续', next: 'c2_price' }],
    },

    c2_price: {
        bg: 'hospital_inside_2',
        dog: '',
        doctor: 'ask',
        doctorPos: { x: 24, y: -153 },
        doctorScale:1,
        texts: [
            '“受伤的时间有点长了，再晚一点，可能\n会感染。”医生说',
            '“另外，最好做个全身检查。”',
            '我突然有点犹豫',
            '如果费用太高，这个月可能就紧张了。\n你心里默想',
            '医生给出了两种方案。',
        ],
        choices: [
            { text: '全面检查＋治疗', next: 'c2_treat_full' },
            { text: '只做基础处理＋抽血化验', next: 'c2_treat_basic' },
        ],
    },

    c2_treat_full: {
        bg: 'hospital_inside_2',
        dog: 'check',
        dogPos: { x: 215, y: -216 },
        dogScaleX: 431 / 770, 
        dogScaleY:477/645, 
        doctor: 'prepare',
        doctorPos: { x: -66, y: -153 },
        doctorScaleX:516/649,
        doctorScaleY:893/911,
        texts: ['你咬咬牙，决定给它完整治疗。', '医生没有多说什么。', '只是开始准备。'],
        choices: [{ text: '等待结果', next: 'c2_after' }],
    },

    c2_treat_basic: {
        bg: 'hospital_inside_2',
        dog: 'check',
        dogPos: { x: 215, y: -216 },
        dogScaleX: 431 / 770, 
        dogScaleY:477/645, 
        doctor: 'prepare',
        doctorPos: { x: -66, y: -153 },
        doctorScaleX:516/649,
        doctorScaleY:893/911,
        texts: [
            '“先处理一下吧。”，你这样说。',
            '医生看了你一眼。没有反对。',
        ],
        choices: [{ text: '等待结果', next: 'c2_after' }],
    },

    c2_after: {
        bg: 'hospital_inside_2',
        dog: 'lay',
        doctor: 'speak',
        doctorPos: { x: -182, y: -171 },
        doctorScaleX:599/649,
        doctorScaleY:1473/911,
        texts: [
            '“从结果看，小狗身体很健康，伤口还需要\n坚持每天清洁，等它慢慢恢复就可以\n了”，医生说。',
            '“另外他应该在户外流浪有一段时间了，\n有点怕人”',
            '你看了眼小狗，它似乎已经适应了这里，\n安静地趴着。',
            '“接下来你打算怎么办？”，医生继续问。',
        ],
        choices: [
            { text: '带它回家', next: 'chapter2_end_home' },
            { text: '联系救助站', next: 'chapter2_end_leave' },
        ],
    },

    chapter2_end_home: {
        bg: 'hospital_inside_2',
        dog: 'hug_home',
        dogPos: { x: -4, y: -701 },
        dogScaleX: (1005 / 770)*1.5, 
        dogScaleY:1.5, 
        texts: [
            '“我打算先带它回家。”，你这样说。',
            '你伸手把小狗抱了起来。',
            '它没有反抗，只是安静地贴着你。',
            '你突然意识到——',
            '它好像，已经开始依赖你了。',
        ],
        choices: [],
    },

    chapter2_end_leave: {
        bg: 'hospital_inside_2',
        dog: 'sit',
        dogPos: { x: 201, y: -100 },
        dogScaleX: 296 / 770, 
        dogScaleY:459/645, 
        texts: [
            '你决定把它交给医生。',
            '它似乎听懂了，突然坐起来望着你',
            '...你站在原地。',
            '有点不太确定。',
        ],
        choices: [],
    },
};

// ---------------------------------------------------------------------------
// GameManager：根据 currentSceneId 驱动 UI
// ---------------------------------------------------------------------------

@ccclass('GameManager')
export class GameManager extends Component {
    /** 当前场景 id（与 storyData 的 key 对应） */
    currentSceneId: string = 'scene1';

    /** 当前显示到 texts 的第几句（0-based） */
    currentLineIndex: number = 0;

    /** 当前 scene 的 texts 是否已经全部显示完毕 */
    isTypingFinished: boolean = false;

    /** 是否已进入“等待显示选项”或“已显示选项”阶段，防止重复触发 */
    isShowingChoices: boolean = false;

    /** 文本推进点击防抖锁 */
    isClickLocked: boolean = false;

    // ----- 剧情主文本 -----
    @property(Label)
    storyLabel: Label = null!;

    // ----- 点击推进的透明区域（只点它才推进） -----
    @property(Node)
    nextNode: Node = null!;

    // ----- 章节之间的过渡按钮（只点它才推进） -----
    @property(Node)
    chapterButton: Node | null = null;

    // ----- 三个固定按钮及其上的文字 -----
    @property(Button)
    button1: Button = null!;

    @property(Label)
    buttonLabel1: Label = null!;

    @property(Button)
    button2: Button = null!;

    @property(Label)
    buttonLabel2: Label = null!;

    @property(Button)
    button3: Button = null!;

    @property(Label)
    buttonLabel3: Label = null!;

    @property(Sprite)
    bgSprite: Sprite | null = null;

    @property([SpriteFrame])
    bgList: SpriteFrame[] = [];

    private bgMap: Record<string, SpriteFrame> = {};

    @property(Sprite)
    dogSprite: Sprite | null = null;

    @property([SpriteFrame])
    dogList: SpriteFrame[] = [];

    private dogMap: Record<string, SpriteFrame> = {};

    @property(Sprite)
    doctorSprite: Sprite | null = null;

    @property([SpriteFrame])
    doctorList: SpriteFrame[] = [];

    private doctorMap: Record<string, SpriteFrame> = {};

    /** 便于按索引访问按钮与标签 */
    private get choiceButtons(): Button[] {
        return [this.button1, this.button2, this.button3];
    }

    private get choiceLabels(): Label[] {
        return [this.buttonLabel1, this.buttonLabel2, this.buttonLabel3];
    }

    /** 用于 scheduleOnce/unschedule 的稳定回调引用 */
    private readonly _delayedShowChoices = () => {
        this.showChoices();
    };

    onLoad() {
        this.bgMap = {
            street: this.bgList[0],
            corner: this.bgList[1],
            street_2: this.bgList[2],
            hospital_outside: this.bgList[3],
            hospital_inside: this.bgList[4],
            hospital_inside_2: this.bgList[5],

        };

        this.dogMap = {
            blood: this.dogList[0],
            angry: this.dogList[1],
            eat: this.dogList[2],
            not_eat: this.dogList[3],
            full: this.dogList[4],
            touch: this.dogList[5],
            hug: this.dogList[6],
            hug_unconfortable: this.dogList[7],
            check: this.dogList[8],
            lay: this.dogList[9],
            hug_home: this.dogList[10],
            sit: this.dogList[11],
        };

        this.doctorMap = {
            check: this.doctorList[0],
            ask: this.doctorList[1],
            prepare: this.doctorList[2],
            speak: this.doctorList[3],
        };

        // 在代码里绑定点击，统一走 onClickChoice(index)
        const buttons = this.choiceButtons;
        for (let i = 0; i < buttons.length; i++) {
            const index = i;
            buttons[i].node.on(Button.EventType.CLICK, () => this.onClickChoice(index), this);
        }

        // 只允许点击 nextNode 推进文本（按钮点击不推进）
        this.nextNode.on(Node.EventType.TOUCH_START, this.onClickNext, this);
    }

    start() {
        // 进入游戏时从 scene1 开始
        this.loadScene('scene1');
    }

    /**
     * 加载指定 id 的场景：
     * - 重置 currentLineIndex / isTypingFinished
     * - 显示第一句 texts[0]
     * - 隐藏所有按钮（choices 延迟到文本结束后再显示）
     */
    loadScene(sceneId: string) {
        // 切 scene 时，取消可能存在的延迟展示按钮任务
        this.unschedule(this._delayedShowChoices);

        const data = storyData[sceneId];
        if (!data) {
            console.warn(`[GameManager] 未找到场景: ${sceneId}`);
            return;
        }

        this.currentSceneId = sceneId;

        this.currentLineIndex = 0;
        this.isTypingFinished = false;
        this.isShowingChoices = false;

        // 显示第一句（若 texts 为空，则显示空串并立刻进入“结束”状态）
        const firstLine = data.texts[0] ?? '';
        this.storyLabel.string = firstLine;
        this.updateBG(data.bg);
        this.updateDog(
            data.dog,
            data.dogPos,
            data.dogScale,
            data.dogScaleX,
            data.dogScaleY,
        );
        this.updateDoctor(
            data.doctor,
            data.doctorPos,
            data.doctorScale,
            data.doctorScaleX,
            data.doctorScaleY,
        );

        // 文本未结束前必须隐藏按钮
        this.hideAllChoices();
        this.nextNode.active = true;
        if (this.chapterButton) {
            this.chapterButton.active = false;
        }
    }

    getBg(name: string): SpriteFrame | null {
        return this.bgMap[name] || null;
    }

    updateBG(name: string) {
        const sf = this.getBg(name);
        if (sf && this.bgSprite) {
            this.bgSprite.spriteFrame = sf;
        }
    }

    updateDog(
        name: string,
        pos?: { x: number; y: number },
        scale?: number,
        scaleX?: number,
        scaleY?: number,
    ) {
        if (!this.dogSprite) return;

        const sf = this.dogMap[name];

        if (!sf) {
            this.dogSprite.node.active = false;
            return;
        }

        this.dogSprite.node.active = true;
        this.dogSprite.spriteFrame = sf;

        if (pos) {
            this.dogSprite.node.setPosition(pos.x, pos.y);
        }

        if (scaleX !== undefined || scaleY !== undefined) {
            const n = this.dogSprite.node;
            const s = n.scale;
            const sx = scaleX !== undefined ? scaleX : scale !== undefined ? scale : s.x;
            const sy = scaleY !== undefined ? scaleY : scale !== undefined ? scale : s.y;
            n.setScale(sx, sy, 1);
        } else if (scale !== undefined) {
            this.dogSprite.node.setScale(scale, scale, 1);
        }
    }

    updateDoctor(
        name?: string,
        pos?: { x: number; y: number },
        scale?: number,
        scaleX?: number,
        scaleY?: number,
    ) {
        if (!this.doctorSprite) return;

        this.doctorSprite.node.setPosition(0, 0);
        this.doctorSprite.node.setScale(1, 1, 1);

        const sf = name != null ? this.doctorMap[name] : undefined;

        if (!sf) {
            this.doctorSprite.node.active = false;
            return;
        }

        this.doctorSprite.node.active = true;
        this.doctorSprite.spriteFrame = sf;

        if (pos) {
            this.doctorSprite.node.setPosition(pos.x, pos.y);
        }

        if (scaleX !== undefined || scaleY !== undefined) {
            const n = this.doctorSprite.node;
            const s = n.scale;
            const sx = scaleX !== undefined ? scaleX : scale !== undefined ? scale : s.x;
            const sy = scaleY !== undefined ? scaleY : scale !== undefined ? scale : s.y;
            n.setScale(sx, sy, 1);
        } else if (scale !== undefined) {
            this.doctorSprite.node.setScale(scale, scale, 1);
        }
    }

    /**
     * 用户点击第 index 个可见按钮（0、1、2）时调用，跳转到对应选项的 next 场景
     */
    onClickChoice(index: number) {
        const data = storyData[this.currentSceneId];
        if (!data) {
            return;
        }

        const choice = data.choices[index];
        if (!choice) {
            return;
        }

        this.loadScene(choice.next);
    }

    /**
     * 点击 nextNode 推进文本（每次只推进一行，不做打字机效果）
     */
    onClickNext() {
        if (this.isClickLocked) {
            return;
        }

        this.isClickLocked = true;
        this.scheduleOnce(() => {
            this.isClickLocked = false;
        }, 0.15);

        // 已经在显示选项流程中时，不再响应推进点击
        if (this.isShowingChoices) {
            return;
        }

        const data = storyData[this.currentSceneId];
        if (!data) {
            return;
        }

        const totalLines = data.texts.length;

        // onClickNext 只负责推进文本，不在同一次点击里处理最后一句逻辑
        if (this.currentLineIndex < totalLines - 1) {
            this.currentLineIndex++;
            this.storyLabel.string = data.texts[this.currentLineIndex] ?? '';
            this.tryShowChoices();
            return;
        }

        // 已在最后一句时不再推进，只尝试触发延迟显示按钮
        this.tryShowChoices();
    }

    /**
     * 当且仅当已到最后一句时，触发一次延迟显示选项
     */
    onEnterChapter2() {
        console.log('进入第二章'); // 👉 用来确认点击生效
    
        if (this.chapterButton) {
            this.chapterButton.active = false;
        }
    
        this.loadScene('chapter2_start');
    }

    private tryShowChoices() {
        if (this.isShowingChoices) {
            return;
        }

        const data = storyData[this.currentSceneId];
        if (!data) {
            return;
        }

        const totalLines = data.texts.length;
        if (totalLines === 0) {
            return;
        }

        if (this.currentLineIndex === totalLines - 1) {
            this.isTypingFinished = true;
            this.isShowingChoices = true;
            this.unschedule(this._delayedShowChoices);
            this.scheduleOnce(this._delayedShowChoices, 0.5);
        }
    }

    /**
     * 根据当前 scene 的 choices 动态显示按钮（最多 3 个）
     */
    showChoices() {
        const data = storyData[this.currentSceneId];
        if (!data) {
            return;
        }

        if (data.choices.length === 0) {
            this.hideAllChoices();
            if (this.currentSceneId === 'chapter_end' || this.currentSceneId === 'chapter_end_2') {
                if (this.chapterButton) {
                    this.chapterButton.active = true;
                }
            }
            this.nextNode.active = false;
            return;
        }

        const choices = data.choices ?? [];
        const maxSlots = 3;

        for (let i = 0; i < maxSlots; i++) {
            const btn = this.choiceButtons[i];
            const lbl = this.choiceLabels[i];
            const choice = choices[i];

            if (choice) {
                btn.node.active = true;
                lbl.string = choice.text;
            } else {
                btn.node.active = false;
                lbl.string = '';
            }
        }

        // 选项出现后，禁用 nextNode，防止继续点击推进文本
        this.nextNode.active = false;
    }

    /** 隐藏所有按钮并清空按钮文字（用于文本未结束前） */
    private hideAllChoices() {
        const maxSlots = 3;
        for (let i = 0; i < maxSlots; i++) {
            this.choiceButtons[i].node.active = false;
            this.choiceLabels[i].string = '';
        }
    }
}
