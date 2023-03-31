const Prompt = require('../../services/Prompt');
const ToolsCLI = require('./ToolsCLI');
const tools = new ToolsCLI();

class QuestionModel {
    constructor(setup = {
        id: '',
        text: '',
        required: false,
        next: '',
        events: {}
    }, questions) {
        const {id, text, required, events} = setup || {};

        this.id = id;
        this.text = text;
        this.required = required;

        this.prompt = new Prompt({ rootPath: __dirname });
        this.events = new EventsHandlers({
            ...(questions && questions.events),
            ...events
        });
    }

    async trigger() {
        try {
            this.events.trigger(this);
            const answer = await this.prompt.question(this.text);
            
            this.answer = answer;
            this.events.answer(this, answer);
            return answer;
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
    }

    async trigger (ev) {
        await this.triggerEvent('onTrigger', ev);
    }

    async next (ev) {
        await this.triggerEvent('onNext', ev);
        console.log('>> onNext');
    }

    async back (ev) {
        await this.triggerEvent('onBack', ev);
        console.log('>> onBack');
    }

    async change (ev) {
        await this.triggerEvent('onChange', ev);
        console.log('>> onChange');
    }

    async repeate (ev) {
        await this.triggerEvent('onRepeate', ev);
        console.log('>> onRepeate');
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

        return answer;
    }

    async error (ev, err) {
        await this.triggerEvent('onError', ev);
        tools.printError(err);
        await ev.trigger();
    }

    async end (ev) {
        await this.triggerEvent('onEnd', ev);
        console.log('>> onEnd');
    }
}

class Questions {
    static QuestionModel = QuestionModel;
    static EventsHandlers = EventsHandlers;

    constructor(setup = {
        startQuestion: '',
        questions: []
    }, view) {
        const { startQuestion, questions, events } = setup || {};

        this.current = null;
        this.startQuestion = startQuestion;
        this.events = new EventsHandlers(events);
        this.questions = Array.isArray(questions) && questions.map(question => new QuestionModel(question, questions));
        
        this.view = () => view;
    }

    getQuestion(id) {
        return this.questions.find(item => item.id === id);
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
        this.events.end(this);
    }
}

module.exports = Questions;
