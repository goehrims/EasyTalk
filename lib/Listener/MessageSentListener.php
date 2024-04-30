<?php

declare(strict_types=1);

/**
 * @copyright Copyright (c) 2024 Marius Goehring <easytalk@mariusgoehring.de>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

namespace OCA\EasyTalk\Listener;

use OCA\Talk\Events\ChatMessageSentEvent;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCA\Talk\Chat\MessageParser;
use OCP\L10N\IFactory;

/**
 * @template-implements IEventListener<Event>
 */
class MessageSentListener implements IEventListener {
	private $logger;
	private $websocket;

	public function __construct(
		protected MessageParser $messageParser,
		protected IFactory $l10nFactory
	) {
		$this->websocket = new \WebSocket\Client("ws://127.0.0.1:8513");
		$this->websocket
		// Add standard middlewares
		->addMiddleware(new \WebSocket\Middleware\CloseHandler())
		->addMiddleware(new \WebSocket\Middleware\PingResponder());
	}

	public function handle(Event $event): void {
		if (!$event instanceof ChatMessageSentEvent) {
			return;
		}
		$l = $this->l10nFactory->get('spreed', 'en', 'en');
		$chatMessage = $this->messageParser->createMessage($event->getRoom(), null, $event->getComment(), $l);
		$this->websocket->text("Reload chat:" . $event->getRoom()->getToken());
		// Close connection
		$this->websocket->close();
	}

}
