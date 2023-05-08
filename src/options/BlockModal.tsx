import { useContext, useEffect, useState } from "preact/hooks";
import { BlockList, blockHint, getOneStorageItem } from "../const";
import { generateId, isValidUrl } from "../helpers";
import { TrafficLightButton } from "../components/TrafficLightButton";
import { ToastContext } from "../context/ToastContext";

export default function BlockModal({
	isVisible = false,
	toggleVisibility,
}: // showToastNotification,
{
	isVisible: boolean;
	toggleVisibility: () => void;
	// showToastNotification: (message: string, color: "green" | "red") => void;
}) {
	const [blockedSites, setBlockedSites] = useState<BlockList[]>([]);
	const [url, setUrl] = useState("");

	const { showToastNotification } = useContext(ToastContext);

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
			showToastNotification("Please enter a valid url.", "red");
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
					showToastNotification("Blacklisted site saved.", "green");
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
				showToastNotification("Blacklisted site deleted.", "green");
			}
		);
	}

	return (
		<div style={{ display: isVisible ? "block" : "none" }} class="modal">
			{/* <!-- Modal content --> */}
			<div class="block-modal-content">
				<div className="headercontainer">
					<div className="pophead">
						<div class="title">Blacklisted Sites</div>

						<TrafficLightButton
							icon="/icons/cancel.svg"
							color="#fe5f58"
							onClick={toggleVisibility}
							tooltip="Close"
						/>
					</div>
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
							<button onClick={addNewBlock} id="blockaddbutton">
								Add
							</button>
						</div>
					</div>
					<p>{blockHint}</p>
				</div>

				{/* <!-- existing rules --> */}

				<div>
					<h3>Block list</h3>
					<div id="blockcontainer">
						{blockedSites?.length ? (
							blockedSites.map((site) => (
								<div key={site.id} class="blockcard">
									<div className="blockcardDetails">
										{/* <span style={{ opacity: "50%" }}>{index + 1} </span> */}
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
							))
						) : (
							<p>No Blacklisting rules yet. Blacklist a specific site above.</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
