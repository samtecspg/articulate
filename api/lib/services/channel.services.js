import Schmervice from 'schmervice';
import Info from './channel/channel.info.service';
import Init from './channel/channel.init.service';
import Validate from './channel/channel.validate.service';
import Post from './channel/channel.post.service';
import Get from './channel/channel.get.service';
import Hash from './channel/channel.hash.service';
import Reply from './channel/channel.reply.service';

module.exports = class ChannelService extends Schmervice.Service {

    async info() {

        return await Info.apply(this, arguments);
    }

    async init() {

        return await Init.apply(this, arguments);
    }

    async validate() {

        return await Validate.apply(this, arguments);
    }

    async post() {

        return await Post.apply(this, arguments);
    }

    async get() {

        return await Get.apply(this, arguments);
    }

    async hash() {

        return await Hash.apply(this, arguments);
    }

    async reply() {

        return await Reply.apply(this, arguments);
    }

};


