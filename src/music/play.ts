import { Player, Track } from "discord-player";
import { Message } from "discord.js";
import { getMusicStreamEmbed } from "../discord/discord-embed";
import { getBasicInfo, videoInfo } from "ytdl-core";
import { YouTube } from "youtube-sr";

interface PlayConfig {
  msg: Message;
  player: Player;
}
const settings = {
  prefix: "!",
};

export async function play({ msg, player }: PlayConfig) {
  const args = msg.content.slice(settings.prefix.length).trim().split(/ +/g);
  const command = args.shift()?.toLowerCase();

  if (command === "play") {
    player
      .play(msg, args[0], true)
      .then()
      .catch(() => {
        if (!msg.member?.voice.channel)
          return msg.channel.send(
            ":no_entry_sign: You're not in a voice channel !"
          );

        if (
          msg.guild?.me?.voice.channel &&
          msg.member.voice.channel.id !== msg.guild?.me?.voice.channel.id
        )
          return msg.channel.send(
            `:no_entry_sign: You are not in the same voice channel !`
          );

        if (!args[0])
          return msg.channel.send(
            `:no_entry_sign: Please indicate the title of a song !`
          );
        return;
      });

    const result = args[0];
    if (result.length > 20) {
      await getBasicInfo(args[0])
        .then((videoUrlData: videoInfo) => {
          const { title, url, duration, thumbnail } = new Track(
            {
              title: videoUrlData.videoDetails.title,
              url: videoUrlData.videoDetails.video_url,
              views: videoUrlData.videoDetails.viewCount,
              thumbnail: videoUrlData.videoDetails.thumbnails[0],
              lengthSeconds: videoUrlData.videoDetails.lengthSeconds,
              description: videoUrlData.videoDetails.description,
              author: {
                name: videoUrlData.videoDetails.author.name,
              },
            },
            msg.author,
            player
          );
          msg.channel.send(
            getMusicStreamEmbed({
              title,
              duration,
              url,
              thumbnailUrl: thumbnail,
              requestedBy: msg.author.username,
            })
          );
        })
        .catch((error) => {});
    } else if (result.length < 20) {
      await YouTube.search(args[0], { type: "video", limit: 2 })
        .then((results) => {
          if (results && results.length !== 0) {
            const tracks = results.map((r) => new Track(r, msg.author, player));
            const firstResult = tracks.pop();
            if (firstResult) {
              msg.channel.send(
                getMusicStreamEmbed({
                  title: firstResult?.title,
                  duration: firstResult?.duration,
                  url: firstResult.url,
                  thumbnailUrl: firstResult.thumbnail,
                  requestedBy: msg.author.username,
                })
              );
            }
          }
        })

        .catch((error) => {});
    }
  }
}
