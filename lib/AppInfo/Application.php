<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2024 Marius Goehring <easytalk@mariusgoehring.de>
 *
 * @author Marius Goehring <easytalk@mariusgoehring.de>
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

namespace OCA\EasyTalk\AppInfo;

use OCA\Talk\Events\ChatMessageSentEvent;
use OCA\EasyTalk\Listener\MessageSentListener;

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use OCA\EasyTalk\WebSocket\WebSocketServer;

use OCP\AppFramework\App;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;

class Application extends App implements IBootstrap {
	public const APP_ID = 'EasyTalk';

	public function __construct(array $urlParams = []) {
		parent::__construct(self::APP_ID, $urlParams);
	}

	public function register(IRegistrationContext $context): void {
		$context->registerEventListener(ChatMessageSentEvent::class, MessageSentListener::class);
	}

	private function isAddressInUse($address, $port) {
	    $socket = @fsockopen($address, $port);
	    if ($socket === false) {
		return false; // Address is not in use
	    } else {
		fclose($socket);
		return true; // Address is in use
	    }
	}

	public function boot(IBootContext $context): void {
		// server.php
		$port = 8513;
		if ($this->isAddressInUse('localhost', $port)) {
			echo "Address is in use";
		} else {
			$server = IoServer::factory(
				new HttpServer(
				    new WsServer(
					new WebSocketServer()
				    )
				),
				$port
			);

			$server->run();

		}
	}
}
