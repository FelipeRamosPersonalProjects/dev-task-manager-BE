const Prompt = require('../../services/Prompt');
const ToolsCLI = require('./ToolsCLI');
const FormCtrlCLI = require('./FormCtrlCLI');
const tools = new ToolsCLI();

class QuestionModel {
    constructor(setup = {
        id: '',
        type: '',
        text: '',
        required: false,
        next: '',
        events: EventsHandlers.prototype,
        formCtrl: Questions.prototype
    }, ctrl) {
        const {id, type, text, required, events, next, formCtrl} = setup || {};

        this.id = id;
        this.type = type || 'default'; // default, multiple-choice, form-control
        this.text = text;
        this.required = required;
        this.next = next;
        this.ctrl = () => ctrl;

        if (this.type === 'form-control') {
            this.formCtrl = new Questions(formCtrl, this)
        }

        this.prompt = new Prompt({ rootPath: __dirname });
        this.events = new EventsHandlers({
            ...(ctrl.questions && ctrl.questions.events),
            ...events
        });
    }

    setValue(key, value) {
        return this.ctrl().setValue(key, value);
    }

    getValue(key) {
        return this.ctrl().getValue(key);
    }

    getQuestion(id) {
        return this.ctrl().getQuestion(id);
    }

    async goToNext() {
        const nextQ = this.ctrl().getQuestion(this.next);
        await this.events.triggerEvent('next', nextQ);
        await nextQ.trigger();
    }

    async trigger() {
        try {
            await this.events.trigger(this);
            const answer = await this.prompt.question(this.text);
            
            this.answer = answer;
            await this.events.triggerEvent('answer', this, answer);

            if (this.next) {
                return await this.goToNext();
            } else {
                return this.ctrl().end();
            }
        } catch(err) {
            this.events.error(this, err);
        }
    }

    setListener(eventName, action) {
        if (!this.events[eventName]) {
            this.events[eventName] = action;
        }
    }

    overrideListener(eventName, action) {
        this.events[eventName] = action;
    }
}

class EventsHandlers {
    constructor(setup = {
        onStart: async () => {},
        onTrigger: async () => {},
        onNext: async () => {},
        onBack: async () => {},
        onChange: async () => {},
        onRepeate: async () => {},
        onAnswer: async () => {},
        onError: async () => {},
        onEnd: async () => {}
    }) {
        const {onStart, onTrigger, onNext, onBack, onChange, onRepeate, onAnswer, onError, onEnd} = setup || {};

        this.onStart = onStart;
        this.onTrigger = onTrigger;
        this.onNext = onNext;
        this.onBack = onBack;
        this.onChange = onChange;
        this.onRepeate = onRepeate;
        this.onAnswer = onAnswer;
        this.onError = onError;
        this.onEnd = onEnd;
    }

    async triggerEvent(...args) {
        const [eventName, ...params] = args || [];

        if (this[eventName]){
            await this[eventName](...params);
        }
    }

    async start (ev) {
        await this.triggerEvent('onStart', ev);
        console.log('>> onStart');
        return ev;
    }

    async trigger (ev) {
        await this.triggerEvent('onTrigger', ev);
        return ev;
    }

    async next (ev) {
        await this.triggerEvent('onNext', ev);
        return ev;
    }

    async back (ev) {
        await this.triggerEvent('onBack', ev);
        console.log('>> onBack');
        return ev;
    }

    async change (ev) {
        await this.triggerEvent('onChange', ev);
        console.log('>> onChange');
        return ev;
    }

    async repeate (ev) {
        await this.triggerEvent('onRepeate', ev);
        console.log('>> onRepeate');
        return ev;
    }

    async answer (ev, answer) {
        await this.triggerEvent('onAnswer', ev, answer);

        if (!answer && ev.required) {
            const error = new Error.Log({
                name: 'AnswerRequired',
                message: `The answer for this question is required!`
            });

            await this.triggerEvent('error', this, error);
            return ev.trigger();
        }

        return ev;
    }

    async error (ev, err) {
        await this.triggerEvent('onError', ev);
        tools.printError(err);
        await ev.trigger();
        return ev;
    }

    async end (ev) {
        await this.triggerEvent('onEnd', ev);
        return ev;
    }
}

class Questions extends FormCtrlCLI {
    static QuestionModel = QuestionModel;
    static EventsHandlers = EventsHandlers;

    constructor(setup = {
        startQuestion: '',
        questions: [],
        values: {}
    }, view) {
        super(setup, view);
        const { startQuestion, questions, events, values } = setup || {};

        this.current = null;
        this.startQuestion = startQuestion;
        this.events = new EventsHandlers(events);
        this.questions = Array.isArray(questions) && questions.map(question => new QuestionModel(question, this));
        this.values = values || {};
        
        this.view = () => view;
    }

    getQuestion(id) {
        return this.questions.find(item => item.id === id);
    }

    getValue(keyPath) {
        const parsedPath = keyPath.split('.');
        let currentValue = this.values;

        parsedPath.map(path => {
            if (currentValue) {
                currentValue = currentValue[path];
            }
        });

        return currentValue;
    }

    setValue(keyPath, value) {
        let currentValue = this.getValue(keyPath)

        if (typeof value === 'object' && !Array.isArray(value)) {
            this.values[keyPath] = {...currentValue, ...value};
        } else {
            this.values[keyPath] = value;
        }
    }

    start() {
        try {
            this.goTo(this.startQuestion);
        } catch(err) {
            this.events.error(this, err)
        }
    }

    async next() {
        try {
            await this.events.next(this);
            return await this.goTo(this.current.next);
        } catch(err) {
            this.events.error(this, err);
        }
    }

    async back() {
        try {
            await this.events.back(this);
            return await this.goTo(this.current.back);
        } catch(err) {
            this.events.error(this, err);
        }
    }

    async goTo(questionID) {
        const question = this.getQuestion(questionID);

        if (question) {
            this.current = question;

            return  await question.trigger();
        } else {
            this.events.error(question)
        }
    }

    async repeate() {
        try {
            await this.events.onRepeate(this);
            return await this.goTo(this.current.id);
        } catch(err) {
            this.events.error(this, err);
        }
    }

    setListener(eventName, action) {
        if (eventName && action) {
            this.events[eventName] = action;

            this.questions.map(q => q.setListener(eventName, action));
        }
    }

    overrideListener(eventName, action) {
        if (eventName && action) {
            this.events[eventName] = action;
        }
    }

    end() {
        this.events.triggerEvent('end');
    }
}

module.exports = Questions;
