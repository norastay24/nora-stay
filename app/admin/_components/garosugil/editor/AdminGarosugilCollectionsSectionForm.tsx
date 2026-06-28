"use client";

import {
  Field,
  ItemShell,
  SectionCard,
  TextArea,
  TextInput,
} from "@/app/admin/_components/garosugil/editor/AdminGarosugilFormPrimitives";
import {
  FloorGuideManager,
  RoomCategoriesManager,
  SectionCopyFields,
} from "@/app/admin/_components/garosugil/editor/AdminGarosugilCollectionCards";
import type { GarosugilContent } from "@/lib/garosugil-content";

type AdminGarosugilCollectionsSectionFormProps = {
  content: GarosugilContent;
  section: "specs" | "floorGuide" | "roomCategories" | "moments";
  onChange: (nextContent: GarosugilContent) => void;
  onUploadFloorImage: (file: File, cardId: string) => void;
  onUploadRoomImage: (file: File, roomId: string) => void;
};

function toLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function AdminGarosugilCollectionsSectionForm({
  content,
  section,
  onChange,
  onUploadFloorImage,
  onUploadRoomImage,
}: AdminGarosugilCollectionsSectionFormProps) {
  return (
    <>
      {section === "specs" ? (
        <SectionCard title="기본 정보 섹션">
          <div className="space-y-4">
            {content.specs.map((item) => (
              <ItemShell key={item.id}>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="라벨 (KR)">
                    <TextInput
                      value={item.label}
                      onChange={(value) =>
                        onChange({
                          ...content,
                          specs: content.specs.map((entry) =>
                            entry.id === item.id ? { ...entry, label: value } : entry,
                          ),
                        })
                      }
                    />
                  </Field>
                  <Field label="라벨 (EN)">
                    <TextInput
                      value={item.labelEn ?? ""}
                      onChange={(value) =>
                        onChange({
                          ...content,
                          specs: content.specs.map((entry) =>
                            entry.id === item.id ? { ...entry, labelEn: value } : entry,
                          ),
                        })
                      }
                    />
                  </Field>
                  <Field label="값 (KR)">
                    <TextInput
                      value={item.value}
                      onChange={(value) =>
                        onChange({
                          ...content,
                          specs: content.specs.map((entry) =>
                            entry.id === item.id ? { ...entry, value } : entry,
                          ),
                        })
                      }
                    />
                  </Field>
                  <Field label="값 (EN)">
                    <TextInput
                      value={item.valueEn ?? ""}
                      onChange={(value) =>
                        onChange({
                          ...content,
                          specs: content.specs.map((entry) =>
                            entry.id === item.id ? { ...entry, valueEn: value } : entry,
                          ),
                        })
                      }
                    />
                  </Field>
                  <Field label="설명 (KR)">
                    <TextInput
                      value={item.description}
                      onChange={(value) =>
                        onChange({
                          ...content,
                          specs: content.specs.map((entry) =>
                            entry.id === item.id ? { ...entry, description: value } : entry,
                          ),
                        })
                      }
                    />
                  </Field>
                  <Field label="설명 (EN)">
                    <TextInput
                      value={item.descriptionEn ?? ""}
                      onChange={(value) =>
                        onChange({
                          ...content,
                          specs: content.specs.map((entry) =>
                            entry.id === item.id ? { ...entry, descriptionEn: value } : entry,
                          ),
                        })
                      }
                    />
                  </Field>
                </div>
              </ItemShell>
            ))}
          </div>
        </SectionCard>
      ) : null}

      {section === "floorGuide" ? (
        <SectionCard title="층별 안내 섹션">
          <SectionCopyFields
            eyebrow={content.floorGuide.eyebrow}
            eyebrowEn={content.floorGuide.eyebrowEn}
            title={content.floorGuide.title}
            titleEn={content.floorGuide.titleEn}
            description={content.floorGuide.description}
            descriptionEn={content.floorGuide.descriptionEn}
            onEyebrowChange={(eyebrow) =>
              onChange({ ...content, floorGuide: { ...content.floorGuide, eyebrow } })
            }
            onEyebrowEnChange={(eyebrowEn) =>
              onChange({ ...content, floorGuide: { ...content.floorGuide, eyebrowEn } })
            }
            onTitleChange={(title) =>
              onChange({ ...content, floorGuide: { ...content.floorGuide, title } })
            }
            onTitleEnChange={(titleEn) =>
              onChange({ ...content, floorGuide: { ...content.floorGuide, titleEn } })
            }
            onDescriptionChange={(description) =>
              onChange({ ...content, floorGuide: { ...content.floorGuide, description } })
            }
            onDescriptionEnChange={(descriptionEn) =>
              onChange({ ...content, floorGuide: { ...content.floorGuide, descriptionEn } })
            }
          />

          <FloorGuideManager
            cards={content.floorGuide.cards}
            onChangeCard={(cardId, updater) =>
              onChange({
                ...content,
                floorGuide: {
                  ...content.floorGuide,
                  cards: content.floorGuide.cards.map((card) =>
                    card.id === cardId ? updater(card) : card,
                  ),
                },
              })
            }
            onUploadImage={onUploadFloorImage}
          />
        </SectionCard>
      ) : null}

      {section === "roomCategories" ? (
        <SectionCard title="객실 섹션">
          <SectionCopyFields
            eyebrow={content.roomCategories.eyebrow}
            eyebrowEn={content.roomCategories.eyebrowEn}
            title={content.roomCategories.title}
            titleEn={content.roomCategories.titleEn}
            description={content.roomCategories.description}
            descriptionEn={content.roomCategories.descriptionEn}
            onEyebrowChange={(eyebrow) =>
              onChange({ ...content, roomCategories: { ...content.roomCategories, eyebrow } })
            }
            onEyebrowEnChange={(eyebrowEn) =>
              onChange({ ...content, roomCategories: { ...content.roomCategories, eyebrowEn } })
            }
            onTitleChange={(title) =>
              onChange({ ...content, roomCategories: { ...content.roomCategories, title } })
            }
            onTitleEnChange={(titleEn) =>
              onChange({ ...content, roomCategories: { ...content.roomCategories, titleEn } })
            }
            onDescriptionChange={(description) =>
              onChange({ ...content, roomCategories: { ...content.roomCategories, description } })
            }
            onDescriptionEnChange={(descriptionEn) =>
              onChange({ ...content, roomCategories: { ...content.roomCategories, descriptionEn } })
            }
          />

          <RoomCategoriesManager
            items={content.roomCategories.items}
            onChangeRoom={(roomId, updater) =>
              onChange({
                ...content,
                roomCategories: {
                  ...content.roomCategories,
                  items: content.roomCategories.items.map((room) =>
                    room.id === roomId ? updater(room) : room,
                  ),
                },
              })
            }
            onUploadImage={onUploadRoomImage}
          />
        </SectionCard>
      ) : null}

      {section === "moments" ? (
        <SectionCard title="모먼트 섹션">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="상단 문구 (KR)">
                <TextInput
                  value={content.moments.eyebrow}
                  onChange={(value) =>
                    onChange({ ...content, moments: { ...content.moments, eyebrow: value } })
                  }
                />
              </Field>
              <Field label="상단 문구 (EN)">
                <TextInput
                  value={content.moments.eyebrowEn ?? ""}
                  onChange={(value) =>
                    onChange({ ...content, moments: { ...content.moments, eyebrowEn: value } })
                  }
                />
              </Field>
              <Field label="제목 (KR)">
                <TextInput
                  value={content.moments.title}
                  onChange={(value) =>
                    onChange({ ...content, moments: { ...content.moments, title: value } })
                  }
                />
              </Field>
              <Field label="제목 (EN)">
                <TextInput
                  value={content.moments.titleEn ?? ""}
                  onChange={(value) =>
                    onChange({ ...content, moments: { ...content.moments, titleEn: value } })
                  }
                />
              </Field>
            </div>

            {content.moments.items.map((item) => (
              <ItemShell key={item.id}>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="아이콘">
                    <TextInput
                      value={item.icon}
                      onChange={(value) =>
                        onChange({
                          ...content,
                          moments: {
                            ...content.moments,
                            items: content.moments.items.map((entry) =>
                              entry.id === item.id ? { ...entry, icon: value } : entry,
                            ),
                          },
                        })
                      }
                    />
                  </Field>
                  <Field label="제목 (KR)">
                    <TextInput
                      value={item.title}
                      onChange={(value) =>
                        onChange({
                          ...content,
                          moments: {
                            ...content.moments,
                            items: content.moments.items.map((entry) =>
                              entry.id === item.id ? { ...entry, title: value } : entry,
                            ),
                          },
                        })
                      }
                    />
                  </Field>
                  <Field label="제목 (EN)">
                    <TextInput
                      value={item.titleEn ?? ""}
                      onChange={(value) =>
                        onChange({
                          ...content,
                          moments: {
                            ...content.moments,
                            items: content.moments.items.map((entry) =>
                              entry.id === item.id ? { ...entry, titleEn: value } : entry,
                            ),
                          },
                        })
                      }
                    />
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="설명 (KR)">
                      <TextArea
                        rows={3}
                        value={item.description.join("\n")}
                        onChange={(value) =>
                          onChange({
                            ...content,
                            moments: {
                              ...content.moments,
                              items: content.moments.items.map((entry) =>
                                entry.id === item.id
                                  ? { ...entry, description: toLines(value) }
                                  : entry,
                              ),
                            },
                          })
                        }
                      />
                    </Field>
                  </div>
                  <div className="md:col-span-2">
                    <Field label="설명 (EN)">
                      <TextArea
                        rows={3}
                        value={item.descriptionEn?.join("\n") ?? ""}
                        onChange={(value) =>
                          onChange({
                            ...content,
                            moments: {
                              ...content.moments,
                              items: content.moments.items.map((entry) =>
                                entry.id === item.id
                                  ? { ...entry, descriptionEn: toLines(value) }
                                  : entry,
                              ),
                            },
                          })
                        }
                      />
                    </Field>
                  </div>
                </div>
              </ItemShell>
            ))}
          </div>
        </SectionCard>
      ) : null}
    </>
  );
}
