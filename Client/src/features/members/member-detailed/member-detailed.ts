import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AgePipe } from '../../../core/pipes/age-pipe';
import { AccountService } from '../../../core/services/account-service';
import { MemberService } from '../../../core/services/member-service';
import { LikesService } from '../../../core/services/likes-service';
import { PresenceService } from '../../../core/services/presence-service';

@Component({
  selector: 'app-member-detailed',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AgePipe],
  templateUrl: './member-detailed.html',
  styleUrl: './member-detailed.css'
})
export class MemberDetailed implements OnInit {
  private route = inject(ActivatedRoute);
  protected memberService = inject(MemberService);
  protected likeService = inject(LikesService);
  protected presenceService = inject(PresenceService);
  private accountService = inject(AccountService);
  private router = inject(Router);
  protected title = signal<string | undefined>('Profile');
  protected isCurrentUser = computed(() => {
    const currentUser = this.accountService.currentUser();
    const currentMember = this.memberService.member();
    const routeId = this.route.snapshot.paramMap.get('id');
    return !!currentUser && (currentUser.id === currentMember?.id || currentUser.id === routeId);
  });
  protected hasLiked = computed(() => {
    const member = this.memberService.member();
    return member ? this.likeService.likeIds().includes(member.id) : false;
  });

  toggleLike() {
    const member = this.memberService.member();
    if (!member) return;

    this.likeService.toggleLike(member.id).subscribe({
      next: () => {
        if (this.hasLiked()) {
          this.likeService.likeIds.update(ids => ids.filter(x => x !== member.id));
        } else {
          this.likeService.likeIds.update(ids => [...ids, member.id]);
        }
      }
    });
  }

  ngOnInit(): void {
    this.title.set(this.route.firstChild?.snapshot?.title);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe({
      next: () => {
        this.title.set(this.route.firstChild?.snapshot?.title);
      }
    });
  }
}
