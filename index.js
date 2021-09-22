const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { getModule, React } = require('powercord/webpack');

module.exports = class NSFWtags extends Plugin {
	async startPlugin() {
		this.loadStylesheet('style.css');
		const ChannelItem = getModule(m => m.default && m.default.displayName == 'ChannelItem', false);

		inject('NSFWtags', ChannelItem, 'default', ([{ channel }], props) => {
			const children = props.props.children.props.children[1].props.children[1].props.children;
			if (!channel.nsfw) return props;
			children.push(React.createElement('div', { className: 'nsfw-badge' }, React.createElement('div', { className: 'nsfw-text' }, 'NSFW')));
			return props;
		});
		ChannelItem.default.displayName = 'ChannelItem';
	}
	pluginWillUnload() {
		uninject('NSFWtags');
		document.querySelectorAll('.nsfw-badge').forEach(e => e.remove());
	}
};
