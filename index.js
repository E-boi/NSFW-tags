const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { getModule, React } = require('powercord/webpack');

module.exports = class NSFWtags extends Plugin {
	async startPlugin() {
		this.loadStylesheet('style.css');
		const ChannelItem = getModule(m => m.default && m.default.displayName == 'ChannelItem', false);

		inject('NSFWtags', ChannelItem, 'default', (_, props) => {
			const children = props.props.children.props.children[1].props.children[1].props.children;
			const channel = children[1].props.channel;
			if (!channel.nsfw) return props;
			children.unshift(React.createElement('div', { className: 'nsfw-badge' }, React.createElement('div', { className: 'nsfw-text' }, 'NSFW')));
			return props;
		});
		ChannelItem.default.displayName = 'ChannelItem';
	}
	pluginWillUnload() {
		uninject('NSFWtags');
		document.querySelectorAll('.nsfw-badge').forEach(e => e.remove());
	}
};
