const Prompt = require('../../services/Prompt');
const ToolsCLI = require('./ToolsCLI');
const FormCtrlCLI = require('./FormCtrlCLI');
const StringTemplateBuilder = require('../StringTemplateBuilder');
const tools = new ToolsCLI();

class QuestionModel {
    constructor(setup = {
        id: '',
        type: '',
        text: '',
        required: false,
        next: '',
        events: EventsHandlers.prototype,
        formCtrl: PoolForm.prototype
    }, ctrl) {
        const {id, type, text, required, events, next, formCtrl} = setup || {};

        this.id = id;
        this.type = type || 'default'; // default, form-control
        this.text = text;
        this.required = required;
        this.next = next;
        this.ctrl = () => ctrl;

        if (formCtrl) {
            this.type = 'form-control';
            this.formCtrl = new PoolForm(formCtrl, this);
        }

        this.prompt = new Prompt({ rootPath: __dirname });
        this.events = new EventsHandlers({
            ...(ctrl.questions && ctrl.questions.events),
            ...events
        });
    }

    get tools() {
        return tools;
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

            if (this.text) {
                const answer = await this.prompt.question(this.text);
                
                this.answer = answer;
                await this.events.triggerEvent('answer', this, answer);
            }

            if (this.formCtrl) {
                await this.formCtrl.startPool();
            }

            if (this.next) {
                return await this.goToNext();
            } else {
                return this.ctrl().end();
            }
        } catch(err) {
            this.events.triggerEvent('error', this, err);
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
        onRepeat: async () => {},
        onAnswer: async () => {},
        onError: async () => {},
        onEnd: async () => {}
    }) {
        const {onStart, onTrigger, onNext, onBack, onChange, onRepeat, onAnswer, onError, onEnd} = setup || {};

        this.onStart = onStart;
        this.onTrigger = onTrigger;
        this.onNext = onNext;
        this.onBack = onBack;
        this.onChange = onChange;
        this.onRepeat = onRepeat;
        this.onAnswer = onAnswer;
        this.onError = onError;
        this.onEnd = onEnd;

        this.tools = new ToolsCLI();
    }

    async triggerEvent(...args) {
        const [eventName, ...params] = args || [];

        if (this[eventName]){
            await this[eventName](...params);
        }
    }

    async start (ev) {
        try {
            await this.triggerEvent('onStart', ev, this.tools);
            return ev;
        } catch (err) {
            this.triggerEvent('error', this, err);
        }
    }

    async trigger (ev) {
        try {
            await this.triggerEvent('onTrigger', ev, this.tools);
            return ev;
        } catch (err) {
            this.triggerEvent('error', this, err);
        }
    }

    async next (ev) {
        try {
            await this.triggerEvent('onNext', ev, this.tools);
            return ev;
        } catch (err) {
            this.triggerEvent('error', this, err);
        }
    }

    async back (ev) {
        try {
            await this.triggerEvent('onBack', ev, this.tools);
            console.log('>> onBack');
            return ev;
        } catch (err) {
            this.triggerEvent('error', this, err);
        }
    }

    async repeat (ev) {
        try {
            await this.triggerEvent('onRepeat', ev, this.tools);
            console.log('>> onRepeat');
            return ev;
        } catch (err) {
            this.triggerEvent('error', this, err);
        }
    }

    async answer (ev) {
        try {
            if (!ev.answer && ev.required) {
                const error = new Error.Log({
                    name: 'AnswerRequired',
                    message: `The answer for this question is required!`
                });
    
                return ev.trigger();
            }
    
            await this.triggerEvent('onAnswer', ev, this.tools, ev.answer);
            return ev;
        } catch (err) {
            this.triggerEvent('error', this, err);
        }
    }

    async error (ev, err) {
        try {
            await this.triggerEvent('onError', ev, this.tools, new Error.Log(err));
            return ev;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    async end (ev) {
        try {
            await this.triggerEvent('onEnd', ev, this.tools);
            return ev;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

class PoolForm extends FormCtrlCLI {
    static QuestionModel = QuestionModel;
    static EventsHandlers = EventsHandlers;

    constructor(setup = {
        ...this,
        startQuestion: '',
        questions: [],
        values: {}
    }, view) {
        super(setup, view);
        const { startQuestion, questions, events, values } = setup || {};

        this.current = null;
        this.prompt = new Prompt({ rootPath: __dirname });
        this.startQuestion = startQuestion;
        this.events = new EventsHandlers(events);
        this.questions = Array.isArray(questions) && questions.map(question => new QuestionModel(question, this));
        this.values = values || {};
        
        this.view = () => view;
    }

    getQuestion(id) {
        return Array.isArray(this.questions) && this.questions.find(item => item.id === id);
    }

    setQuestion(setup = QuestionModel.prototype) {
        if (setup && Array.isArray(this.questions)) {
            this.questions.push(new QuestionModel(setup));
        }
    }

    async startPool() {
        try {
            await this.events.triggerEvent('start', this);
    
            for (let i = 0; i < this.formFields.length; i++) {
                const currKey = this.formFields[i];
                const fieldSchema = this.getFieldSchema(currKey);
                const currentDoc = this.view().getValue && this.view().getValue('currentDoc');
                let answer = '';
    
                if (currentDoc) {
                    answer = await this.prompt.question(new StringTemplateBuilder()
                        .newLine()
                        .text(`Field -> ${currKey} : ${fieldSchema.type.name}`).newLine()
                        .text(`Current value:`).newLine()
                        .text('- ' + (currentDoc[currKey] || 'EMPTY')).newLine()
                        .newLine()
                        .text(`Enter the new value: `)
                    .end());
                } else {
                    if (this.defaultData && this.mode === 'create' && this.defaultData[currKey]) {
                        answer = this.defaultData[currKey];
                    } else {
                        answer = await this.prompt.question(currKey + ': ');
                    }
                }
    
                if (answer) {
                    switch(fieldSchema.type.name) {
                        case 'Object': {
                            this.setField(currKey, JSON.parse(answer));
                            break;
                        }
                        default: {
                            this.setField(currKey, answer);
                            break
                        }
                    }
    
                    await this.events.triggerEvent('answer', this, answer);
                }
            }
    
            await this.events.triggerEvent('end', this);
            return this.formData;
        } catch(err) {
            throw new Error.Log(err);
        }
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

    setValue(keyPath, value, override) {
        const currentValue = this.getValue(keyPath)

        if (typeof value === 'object' && !Array.isArray(value) ) {
            this.values[keyPath] = override ? {...currentValue, ...value} : value;
        } else {
            this.values[keyPath] = value;
        }
    }

    async start() {
        try {
            await this.events.triggerEvent('start', this); 
            await this.goTo(this.startQuestion);
        } catch(err) {
            await this.events.triggerEvent('error', this, err);
        }
    }

    async next() {
        try {
            await this.events.triggerEvent('next', this);
            return await this.goTo(this.current.next);
        } catch(err) {
            await this.events.triggerEvent('error', this, err);
        }
    }

    async back() {
        try {
            await this.events.triggerEvent('back', this);
            return await this.goTo(this.current.back);
        } catch(err) {
            await this.events.triggerEvent('error', this, err);
        }
    }

    async goTo(questionID) {
        const question = this.getQuestion(questionID);

        if (question) {
            this.current = question;

            return await question.trigger();
        } else {
            tools.print('You need to provide at least one question to the PoolForm instance! The questionID receive is not valid! ['+questionID+']');
        }
    }

    async goToView(viewPath, params) {
        await this.view().goToView(viewPath, params)
    }

    async repeat() {
        try {
            await this.events.triggerEvent('repeat', this);
            return await this.goTo(this.current.id);
        } catch(err) {
            await this.events.error(this, err);
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

    async end() {
        await this.events.triggerEvent('end', this);
    }
}

module.exports = PoolForm;
