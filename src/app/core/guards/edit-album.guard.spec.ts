import { TestBed, async, inject } from '@angular/core/testing';

import { EditAlbumGuard } from './edit-album.guard';

describe('EditAlbumGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EditAlbumGuard]
    });
  });

  it('should ...', inject([EditAlbumGuard], (guard: EditAlbumGuard) => {
    expect(guard).toBeTruthy();
  }));
});
