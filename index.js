const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { getModule, getModuleByDisplayName } = require('powercord/webpack');
const { waitFor } = require('powercord/util');

module.exports = class NSFWtags extends Plugin {
  async startPlugin() {
    this.loadStylesheet('style.scss');
    this.channels = await getModule(['getChannels']);
    this.currentGuild = await getModule(['getLastSelectedGuildId']);

    let oldGuildId;
    const _this = this
    const AnalyticsContext = await getModuleByDisplayName('AnalyticsContext')
    inject("NSFWtags", AnalyticsContext.prototype, 'renderProvider', function (_, res) {
      if (this.props.page !== 'Guild Channel') return res;
      if (_this.currentGuild.getGuildId() !== oldGuildId) {
        oldGuildId = _this.currentGuild.getGuildId();
        _this.injectTag();
      }
      return res;
    })
  }
  pluginWillUnload() {
    uninject("NSFWtags");
  }
  async injectTag() {
    await waitFor('[aria-label="Channels"]') //waiting for the channel list to load
    const guildChannel = this.channels.getChannels(this.currentGuild.getGuildId()).SELECTABLE;
    const e = guildChannel.filter(c => c.channel.nsfw);
    if (e.length === 0) return;
    e.forEach(c => {
      const element = document.querySelector(`[aria-label="${c.channel.name} (text channel)"]`) || document.querySelector(`[aria-label="unread, ${c.channel.name} (text channel)"]`);
      element.parentElement.children[1].innerHTML += `<div class="nsfw-badge"><div class="nsfw-text">NSFW</div></div>`; //Adds the NSFW tag
    });
  }
}