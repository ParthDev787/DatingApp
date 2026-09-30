import { AfterViewChecked, Component, effect, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TimeAgoPipe } from '../../../core/pipes/time-ago-pipe';
import { MessageService } from '../../../core/services/message-service';
import { MemberService } from '../../../core/services/member-service';
import { AccountService } from '../../../core/services/account-service';
import { PresenceService } from '../../../core/services/presence-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-messages',
  imports: [FormsModule, TimeAgoPipe],
  templateUrl: './member-messages.html',
  styleUrl: './member-messages.css'
})
export class MemberMessages implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer?: ElementRef<HTMLDivElement>;
  protected messageService = inject(MessageService);
  protected memberService = inject(MemberService);
  protected accountService = inject(AccountService);
  protected presenceService = inject(PresenceService);
  private route = inject(ActivatedRoute);

  messageContent = '';
  private shouldScroll = false;

  constructor() {
    effect(() => {
      const thread = this.messageService.messageThread();
      if (thread.length > 0) {
        this.shouldScroll = true;
      }
    });
  }

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe({
      next: params => {
        const otherUserId = params.get('id');
        if (!otherUserId) throw new Error('Cannot connect to hub');
        this.messageService.createHubConnection(otherUserId);
      }
    });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  sendMessage() {
    const memberId = this.memberService.member()?.id;
    if (!memberId || !this.messageContent.trim()) return;

    this.messageService.sendMessage(memberId, this.messageContent.trim())?.then(() => {
      this.messageContent = '';
      this.shouldScroll = true;
    });
  }

  scrollToBottom(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    }
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }
}
