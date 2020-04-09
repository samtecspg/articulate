import Schmervice from 'schmervice';
import TimingWrapper from '../../util/service-timing-wrapper';
import Get from './channel/channel.get.service';
import Hash from './channel/channel.hash.service';
import Info from './channel/channel.info.service';
import Init from './channel/channel.init.service';
import Post from './channel/channel.post.service';
import Reply from './channel/channel.reply.service';
import Validate from './channel/channel.validate.service';

module.exports = class ChannelService extends Schmervice.Service {

    async info() {
        return await TimingWrapper({ cls: this, fn: Info, name: 'Info' }).apply(this, arguments);
    }

    async init() {
        return await TimingWrapper({ cls: this, fn: Init, name: 'Init' }).apply(this, arguments);
    }

    async validate() {
        return await TimingWrapper({ cls: this, fn: Validate, name: 'Validate' }).apply(this, arguments);
    }

    async post() {
        return await TimingWrapper({ cls: this, fn: Post, name: 'Post' }).apply(this, arguments);
    }

    async get() {
        return await TimingWrapper({ cls: this, fn: Get, name: 'Get' }).apply(this, arguments);
    }

    async hash() {
        return await TimingWrapper({ cls: this, fn: Hash, name: 'Hash' }).apply(this, arguments);
    }

    async reply() {
        return await TimingWrapper({ cls: this, fn: Reply, name: 'Reply' }).apply(this, arguments);
    }

};


