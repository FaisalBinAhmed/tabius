import { useEffect, useState } from "preact/hooks";
import { BlockList, getOneStorageItem } from "../const";
import { generateId, isValidUrl } from "../helpers";
import { TrafficLightButton } from "../components/TabgroupCard";

export default function BlockModal({
	isVisible = false,
	toggleVisibility,
}: {
	isVisible: boolean;
	toggleVisibility: () => void;
}) {
	const [blockedSites, setBlockedSites] = useState<BlockList[]>([]);
	const [url, setUrl] = useState("");

	useEffect(() => {
		restoreBlockSites();
	}, []);

	function onUrlChange(e) {
		if (e.target.value) {
			setUrl(e.target.value);
		}
	}

	async function restoreBlockSites() {
		const bl = await getOneStorageItem("blocklist");
		if (bl?.blocklist?.length) {
			setBlockedSites(bl.blocklist); //TODO type safe this
		}
	}

	function addNewBlock() {
		const id = generateId();

		if (!isValidUrl(url)) {
			// set_status("Please enter a valid url.", "red");
		} else {
			const newSite: BlockList = {
				id: id,
				blockedUrl: url,
			};

			let newBlockList = [...blockedSites, newSite];

			chrome.storage.sync.set(
				{
					blocklist: newBlockList,
				},
				function () {
					setBlockedSites(newBlockList);
					// Update status to let user know options were saved.
					setUrl("");
					// set_status("Blacklisted site saved.");
				}
			);
		}
	}

	function deleteRule(id: string) {
		let newArray = blockedSites.filter((item) => item.id !== id); // replace this with actually deleting the rule in the localstorage

		chrome.storage.sync.set(
			{
				blocklist: newArray,
			},
			function () {
				setBlockedSites(newArray);
				// set_status("Blacklisted site deleted.");
			}
		);
	}

	return (
		<div style={{ display: isVisible ? "block" : "none" }} class="modal">
			{/* <!-- Modal content --> */}
			<div class="block-modal-content">
				<div style="padding: 20px 20px 0px 20px">
					<span onClick={toggleVisibility} class="blockclose">
						&times;
					</span>
					<p style="margin: 0px 0px 10px 0px; font-weight: 500">
						Blacklist for Tab Grouping
					</p>

					{/* <!-- adding rules content --> */}

					<div id="ruleinputcontainer">
						<div class="inputblock" style="flex: 1">
							<label for="groupsite">URL</label>
							<input
								type="text"
								placeholder="https://facebook.com"
								name="groupsite"
								id="urlToBeBlocked"
								value={url}
								onInput={onUrlChange}
							/>
						</div>

						<div class="inputblock">
							<label>&#10240;</label>
							<button onClick={addNewBlock} id="blockaddbutton">
								Add
							</button>
						</div>
					</div>

					{/* <!-- existing rules --> */}
					<p style="font-size: 12px">
						Please put the website URL in this format: "https://somewebsite.com"
						or "http://sub.domain.com" without the quotes. Note: only the origin
						part of the URL (https://www.domain.com) is considered when
						blacklisting. The rules are applicable when you open new tabs from
						these websites - in other words - when they are the{" "}
						<b>original tab</b>. The rules are also <b>subdomain sensitive</b>,
						meaning "https://en.wikipedia.com" is treated differenty than
						"https://wikipedia.com".
					</p>
				</div>
				<div
					style="
								background-color: #0d0d0d;
								color: #fff;
								padding: 10px 20px 20px 20px;
							">
					<p style="margin: 0px 0px 10px 0px; font-size: 16px">
						Blacklisted Sites:
					</p>
					<div id="blockcontainer">
						{blockedSites?.length ? (
							<div>
								{blockedSites.map((site, index) => (
									<div class="blockcard">
										<div>
											<span>{index + 1} </span>
											<span>{site.blockedUrl}</span>
										</div>
										<div class="trafficLights">
											<TrafficLightButton
												icon="/icons/trash.svg"
												color="red"
												onClick={() => deleteRule(site.id)}
												tooltip="Delete this rule"
											/>
										</div>
									</div>
								))}
							</div>
						) : (
							<p style="font-size: 12px !important">
								No Blacklisting rules yet. Blacklist a specific site above.
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
