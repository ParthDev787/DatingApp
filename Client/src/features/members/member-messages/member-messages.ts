import { AfterViewChecked, Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TimeAgoPipe } from '../../../core/pipes/time-ago-pipe';
import { MessageService } from '../../../core/services/message-service';
import { MemberService } from '../../../core/services/member-service';
import { AccountService } from '../../../core/services/account-service';
import { Message } from '../../../types/message';

@Component({
  selector: 'app-member-messages',
  imports: [FormsModule, TimeAgoPipe],
  templateUrl: './member-messages.html',
  styleUrl: './member-messages.css'
})
export class MemberMessages implements OnInit, AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer?: ElementRef<HTMLDivElement>;
  protected messageService = inject(MessageService);
  protected memberService = inject(MemberService);
  protected accountService = inject(AccountService);

  messages = signal<Message[]>([]);
  messageContent = '';
  loading = signal(false);
  private shouldScroll = false;

  ngOnInit(): void {
    this.loadMessages();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  loadMessages() {
    const memberId = this.memberService.member()?.id;
    if (!memberId) return;

    this.loading.set(true);
    this.messageService.getMessageThread(memberId).subscribe({
      next: messages => {
        this.messages.set(messages);
        this.loading.set(false);
        this.shouldScroll = true;
      },
      error: () => this.loading.set(false)
    });
  }

  sendMessage() {
    const memberId = this.memberService.member()?.id;
    if (!memberId || !this.messageContent.trim()) return;

    this.messageService.sendMessage(memberId, this.messageContent.trim()).subscribe({
      next: message => {
        this.messages.update(msgs => [...msgs, message]);
        this.messageContent = '';
        this.shouldScroll = true;
      }
    });
  }

  scrollToBottom(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    }
  }
}
