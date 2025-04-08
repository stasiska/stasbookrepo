import { Comment, Like, Media, Post } from "prisma/__generated__";
import {Media as GrpcMedia, Like as GrpcLike, Comment as GrpcComment, Post as GrpcPost} from "@lib/grpc/dist/typings/post_service";

export function toIso(date: Date): string {
    return date.toISOString();
}

export function mapMedia(media: Media): GrpcMedia {
    return {
        id: media.id,
        url: media.url,
        type: media.type,
    }
}

export function mapLike(like: Like): GrpcLike {
    return {
        id: like.id,
        postId: like.postId ?? '',
        userId: like.userId ?? '',
        createdAt: like.createdAt.toISOString()
    }
}

export function mapComment(comment: Comment): GrpcComment {
    return {
        id: comment.id,
        postId: comment.postId ?? '',
        userId: comment.userId ?? '',
        text: comment.text,
        createdAt: toIso(comment.createdAt)
    }
}

export function mapPost(post: Post & {
    medias?: Media[],
    likes?: Like[],
    comments?: Comment[]
}): GrpcPost {
    return {
        id: post.id,
        content: post.content,
        authorId: post.authorId,
        media: post.medias?.map(mapMedia) ?? [],
        likes: post.likes?.map(mapLike) ?? [],
        comments: post.comments?.map(mapComment) ?? [],
        createdAt: toIso(post.createdAt),
        updatedAt: toIso(post.updatedAt)
    }
} 