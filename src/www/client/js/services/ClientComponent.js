export default class ClientComponent {
    constructor(setup) {
        try {
            const { path, data, stringHTML } = Object(setup);

            if (!path) {
                throw new Error('The "path" param is required at ClientComponent!');
            }

            this.path = path;
            this.data = Object(data);
            this.stringHTML = stringHTML || '';
            this.$element = this.stringHTML ? $(this.stringHTML) : $([]);
        } catch (err) {
            throw new Error(err);
        }
    }

    async load(mergeData) {
        try {
            const bodyData = {...this.data, ...mergeData};
            const response = await fetch('/components', {
                headers: { 'Content-Type': 'application/json' },
                method: 'post',
                body: JSON.stringify({
                    path: this.path,
                    data: bodyData
                })
            });
            const data = await response.json();

            if (data.error) {
                throw data;
            }

            const parsedData = JSON.parse(data);
            
            if (parsedData.success) {
                this.data = Object(bodyData);
                this.updateStringHTML(parsedData.data);

                return this.$element;
            } else {
                throw parsedData;
            }
        } catch (err) {
            console.error(err.message, err);
        }
    }

    updateStringHTML(string) {
        this.stringHTML = string;
        this.$element = $(this.stringHTML);

        if (this.$wrap) {
            this.$wrap.html(this.$element);
        }

        return string;
    }
}
