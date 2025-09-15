-- AlterTable
ALTER TABLE "public"."Post" ADD COLUMN     "photoUrl" TEXT NOT NULL DEFAULT 'https://media.sproutsocial.com/uploads/2022/05/How-to-post-on-instagram-from-pc.jpg';

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "avatarUrl" TEXT NOT NULL DEFAULT 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg';
