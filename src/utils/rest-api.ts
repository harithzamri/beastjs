import got from "got";
import { getLogger } from "./logger";

interface BttvRoomResponse {
  emotes: Array<{ id: string; code: string }>;
}

const logger = getLogger({
  name: "beast-rest-api",
});
