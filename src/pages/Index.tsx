import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { Textarea } from '@/components/ui/textarea';

interface Ability {
  id: string;
  name: string;
  description: string;
  type: 'ability' | 'spell';
}

interface Stats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

const Index = () => {
  const [characterName, setCharacterName] = useState('');
  const [characterClass, setCharacterClass] = useState('');
  const [level, setLevel] = useState(1);
  const [stats, setStats] = useState<Stats>({
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  });
  const [abilities, setAbilities] = useState<Ability[]>([]);
  const [newAbilityName, setNewAbilityName] = useState('');
  const [newAbilityDesc, setNewAbilityDesc] = useState('');
  const [abilityType, setAbilityType] = useState<'ability' | 'spell'>('ability');

  const updateStat = (stat: keyof Stats, value: number) => {
    setStats(prev => ({ ...prev, [stat]: Math.max(1, Math.min(20, value)) }));
  };

  const addAbility = () => {
    if (newAbilityName && newAbilityDesc) {
      setAbilities(prev => [...prev, {
        id: Date.now().toString(),
        name: newAbilityName,
        description: newAbilityDesc,
        type: abilityType
      }]);
      setNewAbilityName('');
      setNewAbilityDesc('');
    }
  };

  const removeAbility = (id: string) => {
    setAbilities(prev => prev.filter(a => a.id !== id));
  };

  const getModifier = (stat: number) => {
    return Math.floor((stat - 10) / 2);
  };

  const statIcons: Record<keyof Stats, string> = {
    strength: 'Dumbbell',
    dexterity: 'Zap',
    constitution: 'Heart',
    intelligence: 'Brain',
    wisdom: 'Eye',
    charisma: 'Sparkles'
  };

  const statLabels: Record<keyof Stats, string> = {
    strength: 'Сила',
    dexterity: 'Ловкость',
    constitution: 'Телосложение',
    intelligence: 'Интеллект',
    wisdom: 'Мудрость',
    charisma: 'Харизма'
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">D&D Билдер Персонажа</h1>
          <p className="text-muted-foreground">Создай уникального героя для своих приключений</p>
        </div>

        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="User" size={24} />
              Основная информация
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Имя персонажа</Label>
              <Input
                id="name"
                placeholder="Введите имя"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class">Класс</Label>
              <Input
                id="class"
                placeholder="Воин, Маг, Плут..."
                value={characterClass}
                onChange={(e) => setCharacterClass(e.target.value)}
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="level">Уровень ({level})</Label>
              <Input
                id="level"
                type="number"
                min="1"
                max="20"
                value={level}
                onChange={(e) => setLevel(Number(e.target.value))}
                className="bg-background/50"
              />
              <Progress value={(level / 20) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="TrendingUp" size={24} />
              Характеристики
            </CardTitle>
            <CardDescription>Значения от 1 до 20</CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.keys(stats) as Array<keyof Stats>).map((stat) => {
              const modifier = getModifier(stats[stat]);
              return (
                <div key={stat} className="space-y-2 p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={stat} className="flex items-center gap-2">
                      <Icon name={statIcons[stat]} size={20} className="text-primary" />
                      {statLabels[stat]}
                    </Label>
                    <Badge variant={modifier >= 0 ? "default" : "destructive"}>
                      {modifier >= 0 ? '+' : ''}{modifier}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStat(stat, stats[stat] - 1)}
                      className="w-10 h-10"
                    >
                      <Icon name="Minus" size={16} />
                    </Button>
                    <Input
                      id={stat}
                      type="number"
                      min="1"
                      max="20"
                      value={stats[stat]}
                      onChange={(e) => updateStat(stat, Number(e.target.value))}
                      className="text-center font-bold text-lg bg-background/50"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStat(stat, stats[stat] + 1)}
                      className="w-10 h-10"
                    >
                      <Icon name="Plus" size={16} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Wand2" size={24} />
              Способности и Заклинания
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="list" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="list">
                  <Icon name="List" size={16} className="mr-2" />
                  Список
                </TabsTrigger>
                <TabsTrigger value="add">
                  <Icon name="Plus" size={16} className="mr-2" />
                  Добавить
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="list" className="space-y-4 mt-4">
                {abilities.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Icon name="PackageOpen" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Пока нет способностей. Добавьте первую!</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {abilities.map((ability) => (
                      <div
                        key={ability.id}
                        className="p-4 rounded-lg bg-muted/30 border border-border space-y-2 group hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Icon 
                              name={ability.type === 'spell' ? 'Sparkles' : 'Swords'} 
                              size={20} 
                              className="text-primary flex-shrink-0"
                            />
                            <h4 className="font-semibold">{ability.name}</h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {ability.type === 'spell' ? 'Заклинание' : 'Способность'}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeAbility(ability.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground pl-7">{ability.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="add" className="space-y-4 mt-4">
                <div className="space-y-4 p-4 rounded-lg bg-muted/10 border border-border">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={abilityType === 'ability' ? 'default' : 'outline'}
                      onClick={() => setAbilityType('ability')}
                      className="flex-1"
                    >
                      <Icon name="Swords" size={16} className="mr-2" />
                      Способность
                    </Button>
                    <Button
                      type="button"
                      variant={abilityType === 'spell' ? 'default' : 'outline'}
                      onClick={() => setAbilityType('spell')}
                      className="flex-1"
                    >
                      <Icon name="Sparkles" size={16} className="mr-2" />
                      Заклинание
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ability-name">Название</Label>
                    <Input
                      id="ability-name"
                      placeholder={abilityType === 'spell' ? 'Огненный шар' : 'Второе дыхание'}
                      value={newAbilityName}
                      onChange={(e) => setNewAbilityName(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ability-desc">Описание</Label>
                    <Textarea
                      id="ability-desc"
                      placeholder="Опишите эффект способности или заклинания..."
                      value={newAbilityDesc}
                      onChange={(e) => setNewAbilityDesc(e.target.value)}
                      className="bg-background/50 min-h-24"
                    />
                  </div>
                  
                  <Button onClick={addAbility} className="w-full" size="lg">
                    <Icon name="Plus" size={20} className="mr-2" />
                    Добавить {abilityType === 'spell' ? 'заклинание' : 'способность'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
