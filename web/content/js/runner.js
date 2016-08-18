var Runner = function(options) {
    _.bindAll(this, 'runGetEntities', 'runPublish');

    this.options = _.extend({
        formEl: $('#runForm'),
        resultsEl: $('#results'),
        entityEl: $('#entitiesButton'),
        publishEl: $('#publishButton')
    }, options || {});

    this.form = $(this.options.formEl);
    this.entityButton = $(this.options.entityEl);
    this.publishButton = $(this.options.publishEl);
    this.results = $(this.options.resultsEl);

    this.entityButton.click(this.runGetEntities);
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

    runGetEntities: function(e) {
        e.preventDefault();
        this.runCommand('/api/entities');
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