var Runner = function(options) {
    _.bindAll(this, 'runGetShapes', 'runPublish');

    this.options = _.extend({
        formEl: $('#runForm'),
        resultsEl: $('#results'),
        shapesEl: $('#shapesButton'),
        publishEl: $('#publishButton')
    }, options || {});

    this.form = $(this.options.formEl);
    this.shapesButton = $(this.options.shapesEl);
    this.publishButton = $(this.options.publishEl);
    this.results = $(this.options.resultsEl);

    this.shapesButton.click(this.runGetShapes);
    this.publishButton.click(this.runPublish);

    if(localStorage) {
        connectorInfo = localStorage.getItem("connectorInfo");
        if (connectorInfo) {
            c = JSON.parse(connectorInfo);
            this.form.find('[name=name]').val(c.name);
            this.form.find('[name=importPath]').val(c.importPath);
            this.form.find('[name=settings]').val(JSON.stringify(c.settings));
        }
    }
}

_.extend(Runner.prototype, {

    runGetShapes: function(e) {
        e.preventDefault();
        this.runCommand('/api/shapes');
    },

    runPublish: function(e) {
        e.preventDefault();
        this.runCommand('/api/publish');
    },

    runCommand: function(path) {

        var self = this,
            name = this.form.find('[name=name]').val(),
            importPath = this.form.find('[name=importPath]').val(),
            settings = this.form.find('[name=settings]').val(),
            settingsJSON, executeReq;

        if (!settings) {
            settingsJSON = {};
        } else {
            settingsJSON = JSON.parse(settings);
        }

        executeReq = {
            "name": name,
            "importPath": importPath,
            "settings": settingsJSON
        };

        if(localStorage) {
            localStorage.setItem('connectorInfo', JSON.stringify(executeReq))
        }   
        
        this.results.html('Running...');

        $.ajax({
            type: 'POST',
            url: path,
            dataType: 'json',
            data: JSON.stringify(executeReq)
        })
        .done(function(resp) {
            output = resp.output.replace(/(?:\r\n|\r|\n)/g, '<br />');
            self.results.html(output);
        })
        .fail(function(err) {
            alert("Error: " + err)
        })
        
    }

});