import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/gurd';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
    @Get()
    getBookmarks(){}
    getBookmarkById(){}
    editBookmarkById(){}
    deleteBookmarkById(){}
}
